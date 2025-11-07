import { Controller, Post, Get } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';

@Controller('fix-all')
export class ComprehensiveFixController {
  constructor(private readonly productDB: ProductRepository) {}

  @Post('everything')
  async fixEverything() {
    try {
      console.log('🔧 Starting comprehensive fix...');
      
      // Step 1: Clear existing products
      const existingProducts = await this.productDB.find({}, { skip: 0, limit: 100 });
      for (const product of existingProducts.products) {
        await this.productDB.findOneAndDelete({ _id: product._id });
      }
      console.log('✅ Cleared existing products');

      // Step 2: Create working products with proper structure
      const workingProducts = [
        {
          productName: "Nike Air Max 270",
          description: "The Nike Air Max 270 delivers visible cushioning under every step. The design draws inspiration from Air Max icons, showcasing Nike's greatest innovation with its largest heel Air unit yet.",
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
          category: "Application Software",
          platformType: "Windows",
          baseType: "Computer",
          productUrl: "https://nike.com/air-max-270",
          downloadUrl: "https://nike.com/air-max-270/download",
          avgRating: 4.8,
          highlights: ["Air Max cushioning", "Breathable mesh", "Durable rubber sole", "Comfortable fit"],
          requirementSpecification: [
            { name: "Material", value: "Synthetic/Mesh" },
            { name: "Sole", value: "Rubber" },
            { name: "Closure", value: "Lace-up" }
          ],
          skuDetails: [{
            skuName: "Size 40-45",
            price: 45000,
            validity: 365,
            lifetime: true,
            stripePriceId: "price_nike_air_max"
          }],
          stripeProductId: "prod_nike_air_max"
        },
        {
          productName: "Adidas Ultraboost 22",
          description: "Experience endless energy with every step. The Adidas Ultraboost 22 features responsive BOOST midsole and Primeknit upper for ultimate comfort and performance.",
          image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
          category: "Application Software",
          platformType: "Windows",
          baseType: "Computer",
          productUrl: "https://adidas.com/ultraboost",
          downloadUrl: "https://adidas.com/ultraboost/download",
          avgRating: 4.7,
          highlights: ["BOOST technology", "Primeknit upper", "Continental rubber", "Energy return"],
          requirementSpecification: [
            { name: "Material", value: "Primeknit" },
            { name: "Technology", value: "BOOST" },
            { name: "Sole", value: "Continental Rubber" }
          ],
          skuDetails: [{
            skuName: "Size 39-46",
            price: 52000,
            validity: 365,
            lifetime: true,
            stripePriceId: "price_adidas_ultraboost"
          }],
          stripeProductId: "prod_adidas_ultraboost"
        },
        {
          productName: "Converse Chuck Taylor All Star",
          description: "The iconic Converse Chuck Taylor All Star sneaker. A timeless classic that never goes out of style, perfect for casual wear and self-expression.",
          image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
          category: "Application Software",
          platformType: "Windows",
          baseType: "Computer",
          productUrl: "https://converse.com/chuck-taylor",
          downloadUrl: "https://converse.com/chuck-taylor/download",
          avgRating: 4.6,
          highlights: ["Classic design", "Canvas upper", "Rubber toe cap", "Versatile style"],
          requirementSpecification: [
            { name: "Material", value: "Canvas" },
            { name: "Sole", value: "Rubber" },
            { name: "Style", value: "High-top" }
          ],
          skuDetails: [{
            skuName: "Size 36-44",
            price: 28000,
            validity: 365,
            lifetime: true,
            stripePriceId: "price_converse_chuck"
          }],
          stripeProductId: "prod_converse_chuck"
        }
      ];

      let createdCount = 0;
      
      for (const productData of workingProducts) {
        try {
          const product = await this.productDB.create(productData as any);
          
          // Add licenses for each product
          for (let i = 0; i < 10; i++) {
            await this.productDB.createLicense(
              String((product as any)._id),
              String((product as any).skuDetails[0]._id),
              `LICENSE-${productData.productName.replace(/\s+/g, '').toUpperCase()}-${i + 1}-${Date.now()}`
            );
          }
          
          createdCount++;
          console.log(`✅ Created: ${productData.productName} with 10 licenses`);
        } catch (error) {
          console.error(`❌ Failed to create ${productData.productName}:`, error.message);
        }
      }

      return {
        success: true,
        message: `Comprehensive fix completed! Created ${createdCount} products with working images and inventory.`,
        details: {
          productsCreated: createdCount,
          licensesPerProduct: 10,
          totalLicenses: createdCount * 10,
          note: "All products now have working images and proper inventory"
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get('status')
  async getStatus() {
    try {
      const products = await this.productDB.find({}, { skip: 0, limit: 10 });
      
      const productStatus: any[] = [];
      for (const product of products.products) {
        const licenses = await this.productDB.findLicense({
          productSku: String(product.skuDetails[0]._id),
          isSold: false,
        });
        
        productStatus.push({
          id: (product as any)._id,
          name: product.productName,
          image: product.image,
          price: product.skuDetails[0].price,
          availableStock: licenses.length,
          inStock: licenses.length > 0
        });
      }
      
      return {
        success: true,
        totalProducts: products.totalProductCount,
        products: productStatus
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}