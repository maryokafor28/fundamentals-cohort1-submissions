import { Controller, Post } from '@nestjs/common';
import { ShoeProductsSeeder } from './shoe-products.seeder';

@Controller('seed')
export class SeedController {
  constructor(private readonly shoeProductsSeeder: ShoeProductsSeeder) {}

  @Post('shoes')
  async seedShoeProducts() {
    await this.shoeProductsSeeder.seedShoeProducts();
    return {
      success: true,
      message: 'Shoe products seeded successfully'
    };
  }
}