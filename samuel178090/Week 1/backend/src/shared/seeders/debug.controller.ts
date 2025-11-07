import { Controller, Get, Post } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';

@Controller('debug')
export class DebugController {
  constructor(private readonly productDB: ProductRepository) {}

  @Get('products')
  async checkProducts() {
    try {
      const products = await this.productDB.find({}, { skip: 0, limit: 20 });
      return {
        success: true,
        count: products.totalProductCount,
        products: products.products.map(p => ({
          id: p._id,
          name: p.productName,
          image: p.image,
          price: p.skuDetails?.[0]?.price,
          category: p.category
        }))
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('quick-shoe')
  async createQuickShoe() {
    try {
      const shoe = await this.productDB.create({
        productName: "Test Nike Sneakers",
        description: "Beautiful Nike sneakers for testing",
        image: "https://via.placeholder.com/400x400/FF0000/FFFFFF?text=Nike+Shoe",
        category: "Application Software",
        platformType: "Windows", 
        baseType: "Computer",
        productUrl: "https://test.com",
        downloadUrl: "https://test.com/download",
        avgRating: 4.5,
        highlights: ["Comfortable", "Stylish", "Durable"],
        requirementSpecification: [
          { name: "Material", value: "Leather" },
          { name: "Size", value: "40-45" }
        ],
        skuDetails: [{
          skuName: "Size 40-45",
          price: 25000,
          validity: 365,
          lifetime: true,
          stripePriceId: "price_test_nike"
        }],
        stripeProductId: "prod_test_nike"
      } as any);

      // Add licenses
      for (let i = 0; i < 3; i++) {
        await this.productDB.createLicense(
          String((shoe as any)._id),
          String((shoe as any).skuDetails[0]._id),
          `LICENSE-NIKE-${i + 1}-${Date.now()}`
        );
      }

      return {
        success: true,
        message: "Test shoe created",
        shoe: {
          id: (shoe as any)._id,
          name: shoe.productName,
          image: shoe.image,
          price: shoe.skuDetails[0].price
        }
      };
    } catch (error) {
      return { error: error.message };
    }
  }
}