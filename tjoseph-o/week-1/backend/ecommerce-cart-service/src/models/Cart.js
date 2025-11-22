const mongoose = require('mongoose');


const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Product ID is required'],
    ref: 'Product'
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  subtotal: {
    type: Number,
    default: function() {
      return this.price * this.quantity;
    }
  }
}, {
  _id: false
});

cartItemSchema.pre('save', function() {
  this.subtotal = this.price * this.quantity;
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User ID is required'],
    ref: 'User',
    unique: true 
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0,
    min: [0, 'Total amount cannot be negative']
  },
  totalItems: {
    type: Number,
    default: 0,
    min: [0, 'Total items cannot be negative']
  },
  status: {
    type: String,
    enum: ['active', 'abandoned', 'converted'],
    default: 'active'
  },
  sessionId: {
    type: String,
    sparse: true 
  },
  expiresAt: {
    type: Date,
    default: function() {
      
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});


cartSchema.index({ userId: 1 });
cartSchema.index({ status: 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


cartSchema.virtual('summary').get(function() {
  return {
    itemCount: this.totalItems,
    totalAmount: this.totalAmount,
    isEmpty: this.items.length === 0
  };
});


cartSchema.pre('save', function() {
  this.calculateTotal();
});


cartSchema.methods.addItem = function(productId, name, price, quantity = 1) {
  const existingItemIndex = this.items.findIndex(
    item => item.productId.toString() === productId.toString()
  );

  if (existingItemIndex > -1) {
    this.items[existingItemIndex].quantity += quantity;
    this.items[existingItemIndex].subtotal = 
      this.items[existingItemIndex].price * this.items[existingItemIndex].quantity;
  } else {
    this.items.push({
      productId,
      name,
      price,
      quantity,
      subtotal: price * quantity
    });
  }

  this.calculateTotal();
};


cartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(
    item => item.productId.toString() !== productId.toString()
  );
  this.calculateTotal();
};


cartSchema.methods.updateItemQuantity = function(productId, quantity) {
  if (quantity <= 0) {
    this.removeItem(productId);
    return;
  }

  const itemIndex = this.items.findIndex(
    item => item.productId.toString() === productId.toString()
  );

  if (itemIndex > -1) {
    this.items[itemIndex].quantity = quantity;
    this.items[itemIndex].subtotal = this.items[itemIndex].price * quantity;
    this.calculateTotal();
  }
};


cartSchema.methods.calculateTotal = function() {
  this.totalAmount = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  this.totalItems = this.items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

 
  this.totalAmount = Math.round(this.totalAmount * 100) / 100;
};


cartSchema.methods.clearCart = function() {
  this.items = [];
  this.totalAmount = 0;
  this.totalItems = 0;
};


cartSchema.methods.hasItem = function(productId) {
  return this.items.some(
    item => item.productId.toString() === productId.toString()
  );
};


cartSchema.methods.getItem = function(productId) {
  return this.items.find(
    item => item.productId.toString() === productId.toString()
  );
};


cartSchema.statics.findOrCreateForUser = async function(userId) {
  let cart = await this.findOne({ userId, status: 'active' });
  
  if (!cart) {
    cart = new this({
      userId,
      items: []
    });
    await cart.save();
  }
  
  return cart;
};

cartSchema.statics.getCartWithProducts = async function(userId) {
  return await this.findOne({ userId, status: 'active' })
    .populate({
      path: 'items.productId',
      select: 'name price description imageUrl inStock'
    });
};

module.exports = mongoose.model('Cart', cartSchema);