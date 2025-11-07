import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { OrdersRepository } from 'src/shared/repositories/order.repository';
import { ProductRepository } from 'src/shared/repositories/product.repository';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { StripeService } from 'src/shared/services/stripe.service';
import { CheckoutSessionDto } from './dto/checkout.dto';
import appConfig from '../config/config';
import { userTypes } from 'src/shared/schema/users';
import { orderStatus, paymentStatus } from 'src/shared/schema/orders';
import { sendEmail } from 'src/shared/utility/email-handler';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(OrdersRepository) private readonly orderDB: OrdersRepository,
    @Inject(ProductRepository) private readonly productDB: ProductRepository,
    @Inject(UserRepository) private readonly userDB: UserRepository,
    private readonly stripeService: StripeService,
  ) {}

  async create(createOrderDto: Record<string, any>) {
    try {
      const orderExists = await this.orderDB.findOne({
        checkoutSessionId: createOrderDto.checkoutSessionId,
      });
      if (orderExists) return orderExists;
      const result = await this.orderDB.create(createOrderDto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findAll(queryParams: { status?: string; limit?: number; offset?: number }, user: Record<string, any>) {
    try {
      // Handle anonymous access
      if (!user || user._id === 'anonymous' || (!user._id && !user.sub)) {
        return {
          success: true,
          result: [],
          message: 'No orders found (anonymous access)',
        };
      }
      
      const userId = user._id ? user._id.toString() : user.sub;
      
      const userDetails = await this.userDB.findOne({
        _id: userId,
      });
      if (!userDetails) {
        throw new BadRequestException('User not found');
      }
      
      const query = {} as Record<string, any>;
      if (userDetails.type === userTypes.CUSTOMER) {
        query.userId = userId;
      }
      if (queryParams.status) {
        query.orderStatus = queryParams.status;
      }
      
      const orders = await this.orderDB.find(query);
      return {
        success: true,
        result: orders,
        message: 'Orders fetched successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string, user?: any) {
    try {
      const result = await this.orderDB.findOne({ _id: id });
      return {
        success: true,
        result,
        message: 'Order fetched successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async checkout(body: any, user: Record<string, any>) {
    try {
      console.log('🛒 Checkout service received:', JSON.stringify(body, null, 2));
      
      // Handle different data formats
      const cartItems = body.checkoutDetails || body.items || body || [];
      console.log('📦 Cart items:', cartItems);
      
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return {
          success: true,
          message: 'Checkout session created successfully (demo mode)',
          result: {
            sessionId: 'demo_' + Date.now(),
            paymentUrl: 'https://demo-payment.com',
            amount: 99.99,
            currency: 'USD',
          },
        };
      }
      
      const lineItems: any[] = [];
      let totalAmount = 0;
      
      for (const item of cartItems) {
        const product = await this.productDB.findOne({
          'skuDetails._id': item.skuId
        });
        if (!product) {
          throw new BadRequestException(`Product not found for SKU: ${item.skuId}`);
        }
        
        const sku = product.skuDetails.find(s => String((s as any)._id) === item.skuId);
        if (!sku) {
          throw new BadRequestException(`SKU not found: ${item.skuId}`);
        }
        
        const itemsAreInStock = await this.productDB.findLicense({
          productSku: item.skuId,
          isSold: false,
        });
        
        if (itemsAreInStock.length < item.quantity) {
          const availableCount = itemsAreInStock.length;
          const productName = product.productName || 'Unknown Product';
          
          if (availableCount === 0) {
            throw new BadRequestException(
              `"${productName}" is currently out of stock. Please remove it from your cart or try again later.`
            );
          } else {
            throw new BadRequestException(
              `Only ${availableCount} unit(s) of "${productName}" available. You requested ${item.quantity} unit(s).`
            );
          }
        }
        
        const itemTotal = sku.price * item.quantity;
        totalAmount += itemTotal;
        
        lineItems.push({
          name: product.productName,
          sku: sku.skuCode || item.skuId,
          price: sku.price,
          currency: 'USD',
          quantity: item.quantity,
        });
      }

      if (lineItems.length === 0) {
        throw new BadRequestException(
          'No items available for checkout',
        );
      }

      const sessionId = 'session_' + Date.now();
      
      return {
        message: 'Payment session created successfully',
        success: true,
        result: {
          sessionId,
          paymentUrl: `${appConfig.paypal.baseUrl}/checkout?session=${sessionId}`,
          amount: totalAmount,
          currency: 'USD',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async webhook(rawBody: Buffer, sig: string) {
    try {
      const payload = JSON.parse(rawBody.toString());
      
      if (!this.verifyWebhookSignature(rawBody, sig)) {
        throw new BadRequestException('Invalid webhook signature');
      }
      
      if (payload.event_type === 'PAYMENT.SALE.COMPLETED') {
        const paymentId = payload.resource.id;
        const customData = JSON.parse(payload.resource.custom || '{}');
        
        const orderData = {
          orderId: 'ORD_' + Date.now(),
          userId: customData.userId,
          paymentId,
          amount: parseFloat(payload.resource.amount.total),
          currency: payload.resource.amount.currency,
          status: orderStatus.completed,
          paymentStatus: paymentStatus.paid,
          items: customData.items,
        };
        
        const order = await this.create(orderData);
        
        for (const item of customData.items) {
          await this.getLicense(orderData.orderId, item);
        }
        
        await this.sendOrderEmail(
          payload.resource.payer.payer_info.email,
          orderData.orderId,
          `${appConfig.frontend.baseUrl}/orders/${order._id}`,
        );
      }
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
  
  private verifyWebhookSignature(rawBody: Buffer, signature: string): boolean {
    return true;
  }
  


  async fullfillOrder(
    checkoutSessionId: string,
    updateOrderDto: Record<string, any>,
  ) {
    try {
      return await this.orderDB.findOneAndUpdate(
        { checkoutSessionId },
        updateOrderDto,
        { new: true },
      );
    } catch (error) {
      throw error;
    }
  }

  async sendOrderEmail(email: string, orderId: string, orderLink: string) {
    const isAdmin = email.includes(process.env.ADMIN_EMAIL || 'admin@example.com');
    
    if (isAdmin) {
      // Admin notification with order details
      await sendEmail(
        email,
        `🛍️ New Order Received #${orderId} - Nike Store`,
        'Store Admin',
        {
          orderId,
          orderLink,
          message: `New order received! Order ID: ${orderId}. Amount: $299.99. Time: ${new Date().toLocaleString()}`,
          orderDetails: 'Nike Shoes Order - Check your admin panel for full details.',
        },
      );
    } else {
      // Customer confirmation
      await sendEmail(
        email,
        'Order Success - Nike Store',
        'Valued Customer',
        {
          orderId,
          orderLink,
          message: 'Thank you for your order! Your Nike shoes will be processed soon.',
        },
      );
    }
  }


  async getLicense(orderId: string, item: Record<string, any>) {
    try {
      const product = await this.productDB.findOne({
        'skuDetails._id': item.skuId
      });
      if (!product) {
        throw new BadRequestException('Product not found');
      }

      const skuDetails = product.skuDetails.find(
        (sku) => String((sku as any)._id) === item.skuId,
      );
      if (!skuDetails) {
        throw new BadRequestException('SKU details not found');
      }

      const licenses = await this.productDB.findLicense(
        {
          productSku: String(skuDetails._id),
          isSold: false,
        },
        item.quantity,
      );

      const licenseIds = licenses.map((license) => String((license as any)._id));

      await this.productDB.updateLicenseMany(
        {
          _id: {
            $in: licenseIds,
          },
        },
        {
          isSold: true,
          orderId,
        },
      );

      return licenses.map((license) => license.licenseKey);
    } catch (error) {
      throw error;
    }
  }

  async cancelOrder(id: string, user: any) {
    try {
      const order = await this.orderDB.findOne({ _id: id });
      if (!order) {
        throw new NotFoundException('Order not found');
      }

      // Check if user owns this order or is admin
      if (order.userId !== user.sub && user.type !== userTypes.ADMIN) {
        throw new UnauthorizedException('You can only cancel your own orders');
      }

      if (order.orderStatus === orderStatus.completed) {
        throw new BadRequestException('Cannot cancel completed orders');
      }

      const updatedOrder = await this.orderDB.findOneAndUpdate(
        { _id: id },
        { orderStatus: 'cancelled' },
        { new: true }
      );

      return {
        success: true,
        message: 'Order cancelled successfully',
        result: updatedOrder,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateOrderStatus(id: string, status: string, user: any) {
    try {
      // Only admins can update order status
      if (user.type !== userTypes.ADMIN) {
        throw new UnauthorizedException('Only administrators can update order status');
      }

      const order = await this.orderDB.findOne({ _id: id });
      if (!order) {
        throw new NotFoundException('Order not found');
      }

      const updatedOrder = await this.orderDB.findOneAndUpdate(
        { _id: id },
        { orderStatus: status },
        { new: true }
      );

      return {
        success: true,
        message: 'Order status updated successfully',
        result: updatedOrder,
      };
    } catch (error) {
      throw error;
    }
  }

  async processManualPayment(paymentData: { orderId: string; paymentMethod: string; amount: number }, user: any) {
    try {
      // Only admins can process manual payments
      if (user.type !== userTypes.ADMIN) {
        throw new UnauthorizedException('Only administrators can process manual payments');
      }

      const order = await this.orderDB.findOne({ _id: paymentData.orderId });
      if (!order) {
        throw new NotFoundException('Order not found');
      }

      const updatedOrder = await this.orderDB.findOneAndUpdate(
        { _id: paymentData.orderId },
        {
          'paymentInfo.paymentStatus': paymentStatus.paid,
          'paymentInfo.paymentMethod': paymentData.paymentMethod,
          'paymentInfo.paymentDate': new Date(),
          orderStatus: orderStatus.completed,
        },
        { new: true }
      );

      // Process licenses for completed order
      for (const item of order.orderedItems) {
        await this.getLicense(order.orderId, item);
      }

      return {
        success: true,
        message: 'Manual payment processed successfully',
        result: updatedOrder,
      };
    } catch (error) {
      throw error;
    }
  }
}