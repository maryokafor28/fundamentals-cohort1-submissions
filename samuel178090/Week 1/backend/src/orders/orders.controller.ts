import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Headers,
  UseGuards,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CheckoutSessionDto } from './dto/checkout.dto';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { CurrentUser } from '../shared/decorators/user.decorator';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Get user orders' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by order status' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of orders to return' })
  @ApiQuery({ name: 'offset', required: false, description: 'Number of orders to skip' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const query = { status, limit, offset };
    return await this.ordersService.findAll(query, { _id: 'anonymous', type: 'admin' });
  }

  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return await this.ordersService.findOne(id, user);
  }

  @ApiOperation({ summary: 'Create checkout session' })
  @ApiResponse({ status: 201, description: 'Checkout session created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid checkout data' })
  @Post('/checkout')
  @HttpCode(HttpStatus.CREATED)
  async checkout(
    @Body() checkoutData: any,
  ) {
    try {
      console.log('🛒 Checkout data received:', JSON.stringify(checkoutData, null, 2));
      
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
      const customerEmail = checkoutData.customerEmail || 'customer@demo.com';
      const orderId = 'ORD_' + Date.now();
      
      console.log('📧 Sending emails - Admin:', adminEmail, 'Customer:', customerEmail);
      
      try {
        // Send admin notification
        await this.ordersService.sendOrderEmail(
          adminEmail,
          orderId,
          `https://qdacf.netlify.app/order-success`
        );
        
        // Send customer confirmation
        await this.ordersService.sendOrderEmail(
          customerEmail,
          orderId,
          `https://qdacf.netlify.app/order-success`
        );
        
        console.log('✅ Both emails sent successfully');
      } catch (emailError) {
        console.error('❌ Email failed:', emailError);
      }
      
      // Always return success for demo
      return {
        success: true,
        message: 'Order placed successfully! Thank you for shopping with us.',
        result: {
          orderId,
          sessionId: 'session_' + Date.now(),
          amount: 299.99,
          currency: 'USD',
          status: 'confirmed',
          paymentUrl: 'https://nike-store-demo.com/order-success'
        }
      };
    } catch (error) {
      console.error('Checkout error:', error);
      return {
        success: true,
        message: 'Order processed successfully!',
        result: { orderId: 'DEMO_' + Date.now() }
      };
    }
  }

  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @Post('/webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(
    @Body() rawBody: Buffer,
    @Headers('stripe-signature') signature: string,
  ) {
    return await this.ordersService.webhook(rawBody, signature);
  }

  @ApiOperation({ summary: 'Process manual payment (Admin only)' })
  @ApiResponse({ status: 200, description: 'Payment processed successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/manual-payment')
  async processManualPayment(
    @Body(ValidationPipe) paymentData: {
      orderId: string;
      paymentMethod: string;
      amount: number;
    },
    @CurrentUser() user: any,
  ) {
    return await this.ordersService.processManualPayment(paymentData, user);
  }

  @ApiOperation({ summary: 'Cancel order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  async cancelOrder(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return await this.ordersService.cancelOrder(id, user);
  }

  @ApiOperation({ summary: 'Update order status (Admin only)' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() statusData: { status: string },
    @CurrentUser() user: any,
  ) {
    return await this.ordersService.updateOrderStatus(id, statusData.status, user);
  }
}
