const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    max: [50, 'Quantity cannot exceed 50']
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true
  },
  items: [cartItemSchema],
  totalPrice: {
    type: Number,
    default: 0,
    min: [0, 'Total price cannot be negative']
  }
}, {
  timestamps: true
});

// Calculate total price before saving
cartSchema.pre('save', async function(next) {
  if (this.isModified('items')) {
    await this.populate('items.product');
    this.totalPrice = this.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }
  next();
});

// Instance method to add item
cartSchema.methods.addItem = async function(productId, quantity = 1) {
  const existingItem = this.items.find(item => 
    item.product.toString() === productId.toString()
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({ product: productId, quantity });
  }
  
  return this.save();
};

// Instance method to update item quantity
cartSchema.methods.updateItemQuantity = async function(itemId, quantity) {
  const item = this.items.id(itemId);
  if (!item) {
    throw new Error('Item not found in cart');
  }
  
  if (quantity <= 0) {
    this.items.pull(itemId);
  } else {
    item.quantity = quantity;
  }
  
  return this.save();
};

// Instance method to remove item
cartSchema.methods.removeItem = async function(itemId) {
  this.items.pull(itemId);
  return this.save();
};

// Instance method to clear cart
cartSchema.methods.clearCart = async function() {
  this.items = [];
  return this.save();
};

module.exports = mongoose.model('Cart', cartSchema);
