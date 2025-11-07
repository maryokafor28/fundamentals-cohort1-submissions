import { Controller, Post, Get, Param } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';

@Controller('quick-fix')
export class QuickFixController {
  constructor(private readonly productDB: ProductRepository) {}

  @Get('check/:id')
  async checkSpecificProduct(@Param('id') id: string) {
    try {
      const product = await this.productDB.findOne({ _id: id });
      if (!product) {
        return { found: false, message: `Product ${id} not found` };
      }

      const licenses = await this.productDB.findLicense({
        productSku: String(product.skuDetails[0]._id),
        isSold: false,
      });

      return {
        found: true,
        product: {
          id: (product as any)._id,
          name: product.productName,
          description: product.description,
          image: product.image,
          price: product.skuDetails[0].price,
          availableStock: licenses.length,
          inStock: licenses.length > 0,
          skuDetails: product.skuDetails.map(sku => ({
            id: (sku as any)._id,
            name: sku.skuName,
            price: sku.price
          }))
        }
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('fix-specific/:id')
  async fixSpecificProduct(@Param('id') id: string) {
    try {
      // Update the specific product with working data
      const updated = await this.productDB.findOneAndUpdate(
        { _id: id },
        {
          productName: "Nike Air Force 1",
          description: "The Nike Air Force 1 '07 is the basketball original. You know it. You love it. This is the classic white-on-white colorway that started it all.",
          image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
          'skuDetails.0.price': 42000,
          'skuDetails.0.skuName': "Size 40-45"
        }
      );

      if (!updated) {
        return { success: false, message: 'Product not found' };
      }

      // Add licenses if none exist
      const existingLicenses = await this.productDB.findLicense({
        productSku: String(updated.skuDetails[0]._id),
        isSold: false,
      });

      if (existingLicenses.length === 0) {
        for (let i = 0; i < 5; i++) {
          await this.productDB.createLicense(
            id,
            String(updated.skuDetails[0]._id),
            `LICENSE-NIKE-AF1-${i + 1}-${Date.now()}`
          );
        }
      }

      return {
        success: true,
        message: `Fixed product ${id}`,
        product: {
          id,
          name: updated.productName,
          image: updated.image,
          price: updated.skuDetails[0].price,
          licensesAdded: existingLicenses.length === 0 ? 5 : 0
        }
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('create-working-products')
  async createWorkingProducts() {
    try {
      const products = [
        {
          productName: "Nike Air Force 1 Low",
          description: "The radiance lives on in the Nike Air Force 1 '07, the basketball original that puts a fresh spin on what you know best: durably stitched overlays, clean finishes and the perfect amount of flash to make you shine.",
          image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-shoes-WrLlWX.png",
          category: "Application Software",
          platformType: "Windows",
          baseType: "Computer",
          productUrl: "https://nike.com/air-force-1",
          downloadUrl: "https://nike.com/air-force-1/download",
          avgRating: 4.8,
          highlights: ["Classic design", "Durable construction", "Comfortable fit", "Versatile style"],
          requirementSpecification: [
            { name: "Material", value: "Leather" },
            { name: "Sole", value: "Rubber" },
            { name: "Closure", value: "Lace-up" }
          ],
          skuDetails: [{
            skuName: "Size 40-45",
            price: 42000,
            validity: 365,
            lifetime: true,
            stripePriceId: "price_nike_af1"
          }],
          stripeProductId: "prod_nike_af1"
        },
        {
          productName: "Adidas Stan Smith",
          description: "Clean and simple. The adidas Stan Smith shoes are a timeless icon of street style. This pair honors the legacy with the same minimalist design and premium leather upper.",
          image: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/ee5818b7c2e74c9b9d3fad7800f7c7e8_9366/Stan_Smith_Shoes_White_FX5500_01_standard.jpg",
          category: "Application Software",
          platformType: "Windows",
          baseType: "Computer",
          productUrl: "https://adidas.com/stan-smith",
          downloadUrl: "https://adidas.com/stan-smith/download",
          avgRating: 4.7,
          highlights: ["Minimalist design", "Premium leather", "Iconic style", "Comfortable wear"],
          requirementSpecification: [
            { name: "Material", value: "Leather" },
            { name: "Sole", value: "Rubber" },
            { name: "Style", value: "Low-top" }
          ],
          skuDetails: [{
            skuName: "Size 39-46",
            price: 38000,
            validity: 365,
            lifetime: true,
            stripePriceId: "price_adidas_stan"
          }],
          stripeProductId: "prod_adidas_stan"
        }
      ];

      const created: any[] = [];
      for (const productData of products) {
        const product = await this.productDB.create(productData as any);
        
        // Add licenses
        for (let i = 0; i < 8; i++) {
          await this.productDB.createLicense(
            String((product as any)._id),
            String((product as any).skuDetails[0]._id),
            `LICENSE-${productData.productName.replace(/\s+/g, '').toUpperCase()}-${i + 1}-${Date.now()}`
          );
        }
        
        created.push({
          id: (product as any)._id,
          name: product.productName,
          price: product.skuDetails[0].price
        });
      }

      return {
        success: true,
        message: `Created ${created.length} working products`,
        products: created
      };
    } catch (error) {
      return { error: error.message };
    }
  }
}