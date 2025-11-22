
const request = require('supertest');
const express = require('express');
const CartController = require('../../controllers/cartController');
const User = require('../../models/User');
const Product = require('../../models/Product');
const Cart = require('../../models/Cart');


const app = express();
app.use(express.json());


app.use((req, res, next) => {
  if (req.headers.authorization) {
    req.user = { 
      id: req.headers.authorization,
      role: 'user' 
    };
    next();
  } else {
    res.status(401).json({
      success: false,
      error: 'Access denied. No token provided.'
    });
  }
});


app.post('/cart/add', CartController.addToCart);
app.get('/cart/:userId', CartController.getCart);
app.put('/cart/:userId/items/:productId', CartController.updateCartItem);
app.delete('/cart/:userId/items/:productId', CartController.removeFromCart);
app.delete('/cart/:userId/clear', CartController.clearCart);

describe('CartController', () => {
  let testUser;
  let testProduct;

  beforeEach(async () => {
   
    const userData = global.testUtils.createTestUser();
    testUser = new User(userData);
    await testUser.save();

    
    testProduct = new Product({
      name: 'Test Product',
      description: 'A test product',
      price: 29.99,
      category: 'electronics',
      inStock: true,
      stockQuantity: 10
    });
    await testProduct.save();
  });

  describe('POST /cart/add', () => {
    test('should add item to cart successfully', async () => {
      const cartData = {
        productId: testProduct._id.toString(),
        quantity: 2
      };

      const response = await request(app)
        .post('/cart/add')
        .set('Authorization', testUser._id.toString())
        .send(cartData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cart.items).toHaveLength(1);
      expect(response.body.cart.items[0].quantity).toBe(2);
      expect(response.body.cart.totalAmount).toBe(59.98);
    });

    test('should fail to add item without authentication', async () => {
      const cartData = {
        productId: testProduct._id.toString(),
        quantity: 2
      };

      const response = await request(app)
        .post('/cart/add')
        .send(cartData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('should fail to add item with invalid productId', async () => {
      const cartData = {
        productId: 'invalid-id',
        quantity: 2
      };

      const response = await request(app)
        .post('/cart/add')
        .set('Authorization', testUser._id.toString())
        .send(cartData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('should fail to add item with invalid quantity', async () => {
      const cartData = {
        productId: testProduct._id.toString(),
        quantity: -1
      };

      const response = await request(app)
        .post('/cart/add')
        .set('Authorization', testUser._id.toString())
        .send(cartData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('should fail to add non-existent product', async () => {
      const fakeProductId = '507f1f77bcf86cd799439011';
      const cartData = {
        productId: fakeProductId,
        quantity: 1
      };

      const response = await request(app)
        .post('/cart/add')
        .set('Authorization', testUser._id.toString())
        .send(cartData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Product not found');
    });
  });

  describe('GET /cart/:userId', () => {
    beforeEach(async () => {
      
      const cart = await Cart.findOrCreateForUser(testUser._id);
      cart.addItem(testProduct._id, testProduct.name, testProduct.price, 2);
      await cart.save();
    });

    test('should get user cart successfully', async () => {
      const response = await request(app)
        .get(`/cart/${testUser._id}`)
        .set('Authorization', testUser._id.toString())
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cart.items).toHaveLength(1);
      expect(response.body.cart.totalAmount).toBe(59.98);
    });

    test('should fail to get cart without authentication', async () => {
      const response = await request(app)
        .get(`/cart/${testUser._id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('should fail to get cart with invalid userId', async () => {
      const response = await request(app)
        .get('/cart/invalid-id')
        .set('Authorization', testUser._id.toString())
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('should return empty cart for new user', async () => {
    
      const newUser = new User({
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'TestPassword123!'
      });
      await newUser.save();

      const response = await request(app)
        .get(`/cart/${newUser._id}`)
        .set('Authorization', newUser._id.toString())
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cart.items).toHaveLength(0);
      expect(response.body.cart.totalAmount).toBe(0);
    });
  });

  describe('PUT /cart/:userId/items/:productId', () => {
    beforeEach(async () => {
     
      const cart = await Cart.findOrCreateForUser(testUser._id);
      cart.addItem(testProduct._id, testProduct.name, testProduct.price, 2);
      await cart.save();
    });

    test('should update cart item quantity successfully', async () => {
      const response = await request(app)
        .put(`/cart/${testUser._id}/items/${testProduct._id}`)
        .set('Authorization', testUser._id.toString())
        .send({ quantity: 5 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cart.items[0].quantity).toBe(5);
      expect(response.body.cart.totalAmount).toBe(149.95);
    });

    test('should remove item when quantity is 0', async () => {
      const response = await request(app)
        .put(`/cart/${testUser._id}/items/${testProduct._id}`)
        .set('Authorization', testUser._id.toString())
        .send({ quantity: 0 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cart.items).toHaveLength(0);
      expect(response.body.cart.totalAmount).toBe(0);
    });

    test('should fail to update with invalid quantity', async () => {
      const response = await request(app)
        .put(`/cart/${testUser._id}/items/${testProduct._id}`)
        .set('Authorization', testUser._id.toString())
        .send({ quantity: -1 })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('should fail to update non-existent item', async () => {
      const fakeProductId = '507f1f77bcf86cd799439012';
      const response = await request(app)
        .put(`/cart/${testUser._id}/items/${fakeProductId}`)
        .set('Authorization', testUser._id.toString())
        .send({ quantity: 3 })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /cart/:userId/items/:productId', () => {
    beforeEach(async () => {
      
      const cart = await Cart.findOrCreateForUser(testUser._id);
      cart.addItem(testProduct._id, testProduct.name, testProduct.price, 2);
      await cart.save();
    });

    test('should remove item from cart successfully', async () => {
      const response = await request(app)
        .delete(`/cart/${testUser._id}/items/${testProduct._id}`)
        .set('Authorization', testUser._id.toString())
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cart.items).toHaveLength(0);
      expect(response.body.cart.totalAmount).toBe(0);
    });

    test('should fail to remove non-existent item', async () => {
      const fakeProductId = '507f1f77bcf86cd799439012';
      const response = await request(app)
        .delete(`/cart/${testUser._id}/items/${fakeProductId}`)
        .set('Authorization', testUser._id.toString())
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /cart/:userId/clear', () => {
    beforeEach(async () => {
      
      const cart = await Cart.findOrCreateForUser(testUser._id);
      cart.addItem(testProduct._id, testProduct.name, testProduct.price, 2);
      await cart.save();
    });

    test('should clear cart successfully', async () => {
      const response = await request(app)
        .delete(`/cart/${testUser._id}/clear`)
        .set('Authorization', testUser._id.toString())
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cart.items).toHaveLength(0);
      expect(response.body.cart.totalAmount).toBe(0);
    });

    test('should handle clearing empty cart', async () => {
      await Cart.findOneAndUpdate(
        { userId: testUser._id },
        { items: [], totalAmount: 0, totalItems: 0 }
      );

      const response = await request(app)
        .delete(`/cart/${testUser._id}/clear`)
        .set('Authorization', testUser._id.toString())
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cart.items).toHaveLength(0);
    });
  });
});