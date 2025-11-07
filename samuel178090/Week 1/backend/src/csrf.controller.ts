import { Controller, Get, Req, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      csrfToken(): string;
    }
  }
}

@ApiTags('Security')
@Controller() // Remove 'api/v1' from here
export class CsrfController {
  @Get('csrf-token')
  @ApiOperation({ 
    summary: 'Get CSRF token',
    description: 'Returns a CSRF token for frontend requests. Also sets a cookie.'
  })
  @ApiResponse({ status: 200, description: 'CSRF token generated successfully' })
  @ApiResponse({ status: 500, description: 'Failed to generate CSRF token' })
  getCsrfToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      const token = req.csrfToken();

      res.cookie('XSRF-TOKEN', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000,
        path: '/',
      });

      return {
        csrfToken: token,
        expiresIn: 3600,
      };
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return {
        error: 'Failed to generate CSRF token',
        message: 'CSRF middleware may not be configured',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }     
  }
}