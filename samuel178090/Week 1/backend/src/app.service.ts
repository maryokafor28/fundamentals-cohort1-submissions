import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      success: true,
      message: 'Nike-Style Shoe Store API',
      version: '1.0.0',
      endpoints: {
        users: '/api/v1/users',
        products: '/api/v1/products',
        orders: '/api/v1/orders',
        docs: '/api/docs'
      },
      status: 'Running'
    };
  }

  getTest(): string {
    return 'Test ::  The Heart Coder (DigiZone)';
  }
}
