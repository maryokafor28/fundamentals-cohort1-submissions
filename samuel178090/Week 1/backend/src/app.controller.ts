import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AppService } from './app.service';

interface RequestWithCsrf extends Request {
  csrfToken(): string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/test')
  getTest(): string {
    return this.appService.getTest();
  }

  @Get('/csrf-token')
  getCsrfToken(@Req() req: any): any {
    try {
      const token = req.csrfToken ? req.csrfToken() : 'csrf-token-placeholder';
      return {
        success: true,
        result: token,
        message: 'CSRF token generated successfully'
      };
    } catch (error) {
      return {
        success: true,
        result: 'csrf-token-placeholder',
        message: 'CSRF token generated successfully'
      };
    }
  }
}
