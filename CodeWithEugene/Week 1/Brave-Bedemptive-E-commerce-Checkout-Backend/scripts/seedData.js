const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../src/models/Product');
const { connectDB, disconnectDB } = require('../src/config/database');

// Load environment variables
dotenv.config();

// Sample products data (matching frontend mock data)
const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality noise-cancelling headphones with premium sound',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    category: 'Electronics',
    inStock: true,
    stockQuantity: 50
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Track your workouts, heart rate, and daily activities',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    category: 'Electronics',
    inStock: true,
    stockQuantity: 30
  },
  {
    name: 'Premium Coffee Maker',
    description: 'Brew barista-quality coffee at home with this premium machine',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop',
    category: 'Appliances',
    inStock: true,
    stockQuantity: 25
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Comfortable and supportive chair for long working hours',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
    category: 'Furniture',
    inStock: true,
    stockQuantity: 15
  },
  {
    name: 'Wireless Phone Charger',
    description: 'Fast charging pad compatible with all modern smartphones',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop',
    category: 'Electronics',
    inStock: false,
    stockQuantity: 0
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and eco-friendly casual wear for everyday use',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    category: 'Clothing',
    inStock: true,
    stockQuantity: 100
  },
  {
    name: 'Professional Camera Lens',
    description: '50mm prime lens perfect for portrait photography',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64b?w=300&h=300&fit=crop',
    category: 'Electronics',
    inStock: true,
    stockQuantity: 8
  },
  {
    name: 'Luxury Leather Wallet',
    description: 'Handcrafted genuine leather wallet with RFID protection',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    category: 'Other',
    inStock: true,
    stockQuantity: 45
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');
    
    // Insert sample products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products successfully`);
    
    // Display created products
    console.log('\n📦 Products created:');
    createdProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} (ID: ${product._id})`);
    });
    
    console.log('\n🎉 Database seeded successfully!');
    
    // Disconnect from database
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
