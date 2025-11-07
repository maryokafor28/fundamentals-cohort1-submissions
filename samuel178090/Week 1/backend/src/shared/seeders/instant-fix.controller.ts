import { Controller, Post } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';

@Controller('instant')
export class InstantFixController {
  constructor(private readonly productDB: ProductRepository) {}

  @Post('fix-now')
  async fixNow() {
    try {
      // Delete all existing products
      const existing = await this.productDB.find({}, { skip: 0, limit: 100 });
      for (const p of existing.products) {
        await this.productDB.findOneAndDelete({ _id: p._id });
      }

      // Create 3 simple working products
      const products = [
        {
          productName: "Nike Sneakers",
          description: "Comfortable Nike sneakers for daily wear",
          image: "https://via.placeholder.com/400x400/FF0000/FFFFFF?text=Nike",
          category: "Application Software",
          platformType: "Windows",
          baseType: "Computer",
          productUrl: "https://test.com",
          downloadUrl: "https://test.com",
          avgRating: 4.5,
          highlights: ["Comfortable", "Stylish"],
          requirementSpecification: [{ name: "Size", value: "40-45" }],
          skuDetails: [{ skuName: "Standard", price: 35000, validity: 365, lifetime: true, stripePriceId: "price1" }],
          stripeProductId: "prod1"
        },
        {
          productName: "Adidas Shoes",
          description: "Quality Adidas shoes for sports and casual wear",
          image: "https://via.placeholder.com/400x400/0000FF/FFFFFF?text=Adidas",
          category: "Application Software",
          platformType: "Windows",
          baseType: "Computer",
          productUrl: "https://test.com",
          downloadUrl: "https://test.com",
          avgRating: 4.6,
          highlights: ["Durable", "Comfortable"],
          requirementSpecification: [{ name: "Size", value: "39-46" }],
          skuDetails: [{ skuName: "Standard", price: 42000, validity: 365, lifetime: true, stripePriceId: "price2" }],
          stripeProductId: "prod2"
        },
        {
          productName: "Casual Sneakers",
          description: "Stylish casual sneakers for everyday use",
          image: "https://via.placeholder.com/400x400/00FF00/FFFFFF?text=Casual",
          category: "Application Software",
          platformType: "Windows",
          baseType: "Computer",
          productUrl: "https://test.com",
          downloadUrl: "https://test.com",
          avgRating: 4.4,
          highlights: ["Lightweight", "Breathable"],
          requirementSpecification: [{ name: "Size", value: "38-44" }],
          skuDetails: [{ skuName: "Standard", price: 28000, validity: 365, lifetime: true, stripePriceId: "price3" }],
          stripeProductId: "prod3"
        }
      ];

      const created: any[] = [];
      for (const prod of products) {
        const newProd = await this.productDB.create(prod as any);
        
        // Add 10 licenses
        for (let i = 0; i < 10; i++) {
          await this.productDB.createLicense(
            String((newProd as any)._id),
            String((newProd as any).skuDetails[0]._id),
            `LIC-${i + 1}-${Date.now()}`
          );
        }
        
        created.push({
          id: (newProd as any)._id,
          name: newProd.productName,
          price: newProd.skuDetails[0].price
        });
      }

      return {
        success: true,
        message: "Fixed! Created 3 working products with images and stock",
        products: created
      };
    } catch (error) {
      return { error: error.message };
    }
  }
}