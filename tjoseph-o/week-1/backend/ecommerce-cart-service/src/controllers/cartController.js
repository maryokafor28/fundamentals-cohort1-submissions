const CartService = require('../services/cartService');
const { asyncHandler } = require('../middleware/errorHandler');
const { validate, schemas } = require('../middleware/validation');
const Joi = require('joi');

class CartController {

  static addToCart = [
    validate(schemas.addToCart),
    asyncHandler(async (req, res) => {
      const { productId, quantity = 1 } = req.body;
      const userId = req.user.id;

      const result = await CartService.addToCart(userId, productId, quantity);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: result.message,
        cart: result.cart
      });
    })
  ];

 
  static getCart = [
    validate(schemas.userId, 'params'),
    asyncHandler(async (req, res) => {
      const { userId } = req.params;
      
     
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied. You can only access your own cart.'
        });
      }

      const result = await CartService.getCart(userId);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      res.status(200).json({
        success: true,
        cart: result.cart
      });
    })
  ];

 
  static getCartWithProducts = [
    validate(schemas.userId, 'params'),
    asyncHandler(async (req, res) => {
      const { userId } = req.params;
      
     
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied. You can only access your own cart.'
        });
      }

      const result = await CartService.getCartWithProducts(userId);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      res.status(200).json({
        success: true,
        cart: result.cart
      });
    })
  ];

 
  static updateCartItem = [
    
    (req, res, next) => {
      const paramsSchema = Joi.object({
        userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
        productId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
      });
      
      const { error } = paramsSchema.validate(req.params);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details.map(detail => detail.message).join(', ')
        });
      }
      next();
    },
    validate(schemas.updateCartItem),
    asyncHandler(async (req, res) => {
      const { userId, productId } = req.params;
      const { quantity } = req.body;
      
      
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied. You can only update your own cart.'
        });
      }

      const result = await CartService.updateCartItem(userId, productId, quantity);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: result.message,
        cart: result.cart
      });
    })
  ];

 
  static removeFromCart = [
   
    (req, res, next) => {
      const paramsSchema = Joi.object({
        userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
        productId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
      });
      
      const { error } = paramsSchema.validate(req.params);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details.map(detail => detail.message).join(', ')
        });
      }
      next();
    },
    asyncHandler(async (req, res) => {
      const { userId, productId } = req.params;
      
     
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied. You can only update your own cart.'
        });
      }

      const result = await CartService.removeFromCart(userId, productId);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: result.message,
        cart: result.cart
      });
    })
  ];


  static clearCart = [
    validate(schemas.userId, 'params'),
    asyncHandler(async (req, res) => {
      const { userId } = req.params;
      
      
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied. You can only clear your own cart.'
        });
      }

      const result = await CartService.clearCart(userId);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      res.status(200).json({
        success: true,
        message: result.message,
        cart: result.cart
      });
    })
  ];

 
  static getCartSummary = [
    validate(schemas.userId, 'params'),
    asyncHandler(async (req, res) => {
      const { userId } = req.params;
      
      
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied. You can only access your own cart summary.'
        });
      }

      const result = await CartService.getCartSummary(userId);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      res.status(200).json({
        success: true,
        summary: result.summary
      });
    })
  ];


  static validateCart = [
    validate(schemas.userId, 'params'),
    asyncHandler(async (req, res) => {
      const { userId } = req.params;
      
     
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied. You can only validate your own cart.'
        });
      }

      const result = await CartService.validateCart(userId);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      res.status(200).json({
        success: true,
        valid: result.valid,
        issues: result.issues,
        updatedItems: result.updatedItems,
        cart: result.cart
      });
    })
  ];


  static getCartStats = [
    validate(schemas.userId, 'params'),
    asyncHandler(async (req, res) => {
      const { userId } = req.params;
      
      // Ensure user can only access their own cart stats
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied. You can only access your own cart statistics.'
        });
      }

      const result = await CartService.getCartStats(userId);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      res.status(200).json({
        success: true,
        stats: result.stats
      });
    })
  ];

 
  static transferCart = asyncHandler(async (req, res) => {
    const { sessionId } = req.body;
    const userId = req.user.id;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      });
    }

    const result = await CartService.transferCart(sessionId, userId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: result.message,
      cart: result.cart
    });
  });
}

module.exports = CartController;