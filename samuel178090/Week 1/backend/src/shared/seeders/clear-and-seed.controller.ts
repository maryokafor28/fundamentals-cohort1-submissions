import { Controller, Post, Delete } from '@nestjs/common';
import { ShoeProductsSeeder } from './shoe-products.seeder';
import { FixImagesSeeder } from './fix-images.seeder';
import { ProductRepository } from '../repositories/product.repository';

@Controller('seed')
export class ClearAndSeedController {
  constructor(
    private readonly shoeProductsSeeder: ShoeProductsSeeder,
    private readonly fixImagesSeeder: FixImagesSeeder,
    private readonly productDB: ProductRepository
  ) {}

  @Delete('clear-all')
  async clearAllProducts() {
    try {
      const products = await this.productDB.find({}, { skip: 0, limit: 1000 });
      for (const product of products.products) {
        await this.productDB.findOneAndDelete({ _id: product._id });
      }
      return {
        success: true,
        message: 'All products cleared successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('shoes-only')
  async clearAndSeedShoes() {
    try {
      // Clear existing products
      const products = await this.productDB.find({}, { skip: 0, limit: 1000 });
      for (const product of products.products) {
        await this.productDB.findOneAndDelete({ _id: product._id });
      }
      console.log('🗑️ Cleared all existing products');
      
      // Seed new shoe products
      await this.shoeProductsSeeder.seedShoeProducts();
      
      return {
        success: true,
        message: 'Database cleared and shoe products seeded successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('fix-images')
  async fixImages() {
    try {
      await this.fixImagesSeeder.fixProductImages();
      return {
        success: true,
        message: 'Product images updated successfully'
      };
    } catch (error) {
      throw error;
    }
  }
}