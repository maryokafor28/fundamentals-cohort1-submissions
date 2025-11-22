const orderService = require('../../src/modules/orders/orders.service');
const store = require('../../src/data/store');
const { NotFoundError, ValidationError, ForbiddenError } = require('../../src/utils/errors');

describe('OrderService', () => {
  let testUser;
  let testProduct;

  beforeEach(() => {
    
    store.orders = [];
    store.products = [];
    store.users = [];

   
    testUser = {
      id: 'user_123',
      email: 'test@example.com',
      role: 'user'
    };
    store.users.push(testUser);

    
    testProduct = {
      id: 'product_1',
      name: 'Test Product',
      price: 100,
      stock: 10
    };
    store.products.push(testProduct);
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const items = [{ productId: 'product_1', quantity: 2 }];
      
      const order = await orderService.createOrder(testUser.id, items);

      expect(order).toBeDefined();
      expect(order.id).toMatch(/^order_/);
      expect(order.userId).toBe(testUser.id);
      expect(order.items).toHaveLength(1);
      expect(order.items[0].productId).toBe('product_1');
      expect(order.items[0].quantity).toBe(2);
      expect(order.items[0].price).toBe(100);
      expect(order.items[0].subtotal).toBe(200);
      expect(order.totalAmount).toBe(200);
      expect(order.status).toBe('pending');
      expect(order.createdAt).toBeDefined();
      expect(order.updatedAt).toBeDefined();
      expect(store.orders).toHaveLength(1);
    });

    it('should update product stock when order is created', async () => {
      const items = [{ productId: 'product_1', quantity: 3 }];
      
      await orderService.createOrder(testUser.id, items);

      expect(testProduct.stock).toBe(7);
    });

    it('should create order with multiple items', async () => {
      const product2 = {
        id: 'product_2',
        name: 'Product 2',
        price: 50,
        stock: 20
      };
      store.products.push(product2);

      const items = [
        { productId: 'product_1', quantity: 2 },
        { productId: 'product_2', quantity: 3 }
      ];

      const order = await orderService.createOrder(testUser.id, items);

      expect(order.items).toHaveLength(2);
      expect(order.totalAmount).toBe(350);
      expect(testProduct.stock).toBe(8);
      expect(product2.stock).toBe(17);
    });

    it('should throw ValidationError if items is not an array', async () => {
      await expect(orderService.createOrder(testUser.id, null))
        .rejects.toThrow(ValidationError);
      
      await expect(orderService.createOrder(testUser.id, 'invalid'))
        .rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError if items array is empty', async () => {
      await expect(orderService.createOrder(testUser.id, []))
        .rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError if item missing productId', async () => {
      const items = [{ quantity: 2 }];
      
      await expect(orderService.createOrder(testUser.id, items))
        .rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError if item missing quantity', async () => {
      const items = [{ productId: 'product_1' }];
      
      await expect(orderService.createOrder(testUser.id, items))
        .rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError if quantity is zero or negative', async () => {
      const items = [{ productId: 'product_1', quantity: 0 }];
      
      await expect(orderService.createOrder(testUser.id, items))
        .rejects.toThrow(ValidationError);

      items[0].quantity = -1;
      await expect(orderService.createOrder(testUser.id, items))
        .rejects.toThrow(ValidationError);
    });

    it('should throw NotFoundError if product does not exist', async () => {
      const items = [{ productId: 'nonexistent', quantity: 1 }];
      
      await expect(orderService.createOrder(testUser.id, items))
        .rejects.toThrow(NotFoundError);
    });

    it('should throw ValidationError if insufficient stock', async () => {
      const items = [{ productId: 'product_1', quantity: 20 }];
      
      await expect(orderService.createOrder(testUser.id, items))
        .rejects.toThrow(ValidationError);
      await expect(orderService.createOrder(testUser.id, items))
        .rejects.toThrow('Insufficient stock');
    });
  });

  describe('getAllOrders', () => {
    beforeEach(() => {
      
      store.orders.push(
        {
          id: 'order_1',
          userId: 'user_123',
          items: [],
          totalAmount: 100,
          status: 'pending',
          createdAt: new Date().toISOString()
        },
        {
          id: 'order_2',
          userId: 'user_456',
          items: [],
          totalAmount: 200,
          status: 'shipped',
          createdAt: new Date().toISOString()
        },
        {
          id: 'order_3',
          userId: 'user_123',
          items: [],
          totalAmount: 150,
          status: 'delivered',
          createdAt: new Date().toISOString()
        }
      );
    });

    it('should return all orders when no userId provided (admin)', async () => {
      const orders = await orderService.getAllOrders();

      expect(orders).toHaveLength(3);
    });

    it('should return only user orders when userId provided', async () => {
      const orders = await orderService.getAllOrders('user_123');

      expect(orders).toHaveLength(2);
      expect(orders.every(o => o.userId === 'user_123')).toBe(true);
    });

    it('should return empty array if user has no orders', async () => {
      const orders = await orderService.getAllOrders('user_999');

      expect(orders).toHaveLength(0);
      expect(orders).toEqual([]);
    });
  });

  describe('getOrderById', () => {
    let testOrder;

    beforeEach(() => {
      testOrder = {
        id: 'order_1',
        userId: 'user_123',
        items: [],
        totalAmount: 100,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      store.orders.push(testOrder);
    });

    it('should return order by id without userId (admin)', async () => {
      const order = await orderService.getOrderById('order_1');

      expect(order).toBeDefined();
      expect(order.id).toBe('order_1');
    });

    it('should return order by id when user owns it', async () => {
      const order = await orderService.getOrderById('order_1', 'user_123');

      expect(order).toBeDefined();
      expect(order.id).toBe('order_1');
    });

    it('should throw NotFoundError if order does not exist', async () => {
      await expect(orderService.getOrderById('nonexistent'))
        .rejects.toThrow(NotFoundError);
    });

    it('should throw ForbiddenError if user does not own order', async () => {
      await expect(orderService.getOrderById('order_1', 'user_456'))
        .rejects.toThrow(ForbiddenError);
    });
  });

  describe('updateOrderStatus', () => {
    let testOrder;

    beforeEach(() => {
      testOrder = {
        id: 'order_1',
        userId: 'user_123',
        items: [],
        totalAmount: 100,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      store.orders.push(testOrder);
    });

   

    it('should accept all valid statuses', async () => {
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

      for (const status of validStatuses) {
        testOrder.status = 'pending'; 
        const updated = await orderService.updateOrderStatus('order_1', status);
        expect(updated.status).toBe(status);
      }
    });

    it('should throw ValidationError for invalid status', async () => {
      await expect(orderService.updateOrderStatus('order_1', 'invalid'))
        .rejects.toThrow(ValidationError);
    });

    it('should throw NotFoundError if order does not exist', async () => {
      await expect(orderService.updateOrderStatus('nonexistent', 'processing'))
        .rejects.toThrow(NotFoundError);
    });

    it('should throw ValidationError when updating cancelled order', async () => {
      testOrder.status = 'cancelled';

      await expect(orderService.updateOrderStatus('order_1', 'processing'))
        .rejects.toThrow(ValidationError);
      await expect(orderService.updateOrderStatus('order_1', 'processing'))
        .rejects.toThrow('Cannot update status of cancelled order');
    });
  });

  describe('cancelOrder', () => {
    let testOrder;

    beforeEach(() => {
      testOrder = {
        id: 'order_1',
        userId: 'user_123',
        items: [
          { productId: 'product_1', quantity: 3, price: 100, subtotal: 300 }
        ],
        totalAmount: 300,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      store.orders.push(testOrder);
      testProduct.stock = 7; 
    });

   

    it('should restore product stock when order is cancelled', async () => {
      await orderService.cancelOrder('order_1', 'user_123');

      expect(testProduct.stock).toBe(10);
    });

    it('should restore stock for multiple items', async () => {
      const product2 = {
        id: 'product_2',
        name: 'Product 2',
        price: 50,
        stock: 15
      };
      store.products.push(product2);

      testOrder.items.push({
        productId: 'product_2',
        quantity: 2,
        price: 50,
        subtotal: 100
      });

      await orderService.cancelOrder('order_1', 'user_123');

      expect(testProduct.stock).toBe(10);
      expect(product2.stock).toBe(17);
    });

    it('should throw NotFoundError if order does not exist', async () => {
      await expect(orderService.cancelOrder('nonexistent', 'user_123'))
        .rejects.toThrow(NotFoundError);
    });

    it('should throw ForbiddenError if user does not own order', async () => {
      await expect(orderService.cancelOrder('order_1', 'user_456'))
        .rejects.toThrow(ForbiddenError);
    });

    it('should throw ValidationError if order already cancelled', async () => {
      testOrder.status = 'cancelled';

      await expect(orderService.cancelOrder('order_1', 'user_123'))
        .rejects.toThrow(ValidationError);
      await expect(orderService.cancelOrder('order_1', 'user_123'))
        .rejects.toThrow('already cancelled');
    });

    it('should throw ValidationError if order is delivered', async () => {
      testOrder.status = 'delivered';

      await expect(orderService.cancelOrder('order_1', 'user_123'))
        .rejects.toThrow(ValidationError);
      await expect(orderService.cancelOrder('order_1', 'user_123'))
        .rejects.toThrow('Cannot cancel delivered orders');
    });

    

    it('should handle cancellation when product no longer exists', async () => {
      store.products = []; 

      const cancelledOrder = await orderService.cancelOrder('order_1', 'user_123');

      expect(cancelledOrder.status).toBe('cancelled');
     
    });

        it('should update order status successfully', async () => {
  const originalUpdatedAt = testOrder.updatedAt;
  
 
  await new Promise(resolve => setTimeout(resolve, 10));
  
  const updatedOrder = await orderService.updateOrderStatus('order_1', 'processing');

  expect(updatedOrder.status).toBe('processing');
  expect(updatedOrder.updatedAt).not.toBe(originalUpdatedAt);
});


it('should cancel order successfully', async () => {
  const originalUpdatedAt = testOrder.updatedAt;
  
 
  await new Promise(resolve => setTimeout(resolve, 10));
  
  const cancelledOrder = await orderService.cancelOrder('order_1', 'user_123');

  expect(cancelledOrder.status).toBe('cancelled');
  expect(cancelledOrder.updatedAt).not.toBe(originalUpdatedAt);
});



  });
});