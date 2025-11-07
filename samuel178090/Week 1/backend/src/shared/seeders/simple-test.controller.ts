import { Controller, Get, Post } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';

@Controller('simple')
export class SimpleTestController {
  constructor(private readonly productDB: ProductRepository) {}

  @Get('test')
  async simpleTest() {
    return {
      success: true,
      message: 'API is working!',
      timestamp: new Date().toISOString()
    };
  }

  @Post('create-test-product')
  async createTestProduct() {
    try {
      const testProduct = {
        productName: "Test Nike Air Max",
        description: "Beautiful Nike Air Max sneakers for testing - comfortable and stylish",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center",
        category: "Application Software",
        platformType: "Windows",
        baseType: "Computer",
        productUrl: "https://test.com/nike",
        downloadUrl: "https://test.com/nike/download",
        avgRating: 4.8,
        highlights: ["Comfortable", "Stylish", "Durable", "Breathable"],
        requirementSpecification: [
          { name: "Material", value: "Synthetic Leather" },
          { name: "Size", value: "40-45" },
          { name: "Color", value: "Multiple" }
        ],
        skuDetails: [{
          skuName: "Size 40-45",
          price: 35000,
          validity: 365,
          lifetime: true,
          stripePriceId: "price_test_nike_air"
        }],
        stripeProductId: "prod_test_nike_air"
      };

      const created = await this.productDB.create(testProduct as any);
      
      // Add licenses
      for (let i = 0; i < 5; i++) {
        await this.productDB.createLicense(
          String((created as any)._id),
          String((created as any).skuDetails[0]._id),
          `LICENSE-NIKE-AIR-${i + 1}-${Date.now()}`
        );
      }

      return {
        success: true,
        message: "Test product created successfully",
        product: {
          id: (created as any)._id,
          name: created.productName,
          image: created.image,
          price: created.skuDetails[0].price
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get('count-products')
  async countProducts() {
    try {
      const result = await this.productDB.find({}, { skip: 0, limit: 1 });
      return {
        success: true,
        totalProducts: result.totalProductCount,
        message: `Found ${result.totalProductCount} products in database`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  @Get('list-products')
  async listProducts() {
    try {
      const result = await this.productDB.find({}, { skip: 0, limit: 10 });
      return {
        success: true,
        count: result.totalProductCount,
        products: result.products.map(p => ({
          id: (p as any)._id,
          name: p.productName,
          image: p.image,
          price: p.skuDetails?.[0]?.price || 0
        }))
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}