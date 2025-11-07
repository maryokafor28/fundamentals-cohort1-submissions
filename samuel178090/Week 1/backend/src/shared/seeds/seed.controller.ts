import { Controller, Get, Post } from '@nestjs/common';
import { SeedDataService } from './seed-data.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedDataService: SeedDataService) {}

  @Post('all')
  async seedAll() {
    await this.seedDataService.seedAll();
    return {
      success: true,
      message: 'Database seeded successfully with users and products',
    };
  }

  @Post('users')
  async seedUsers() {
    await this.seedDataService.seedUsers();
    return {
      success: true,
      message: 'Users seeded successfully',
    };
  }

  @Post('products')
  async seedProducts() {
    await this.seedDataService.seedProducts();
    return {
      success: true,
      message: 'Products seeded successfully',
    };
  }

  @Get('products')
  async seedProductsGet() {
    await this.seedDataService.seedProducts();
    return {
      success: true,
      message: 'Products seeded successfully',
    };
  }
}