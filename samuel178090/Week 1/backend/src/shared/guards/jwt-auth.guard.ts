import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import appConfig from '../../config/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedException('Access token is required');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: appConfig.jwtSecret,
      });
      
      // Attach user info to request
      request['user'] = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    console.log('🔍 JWT Guard Debug:');
    console.log('- Path:', request.path);
    console.log('- Authorization header:', request.headers.authorization);
    console.log('- Cookies:', request.cookies);
    
    // Check Authorization header
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      console.log('✅ Found Bearer token in header');
      return authHeader.substring(7);
    }

    // Check cookie
    const cookieToken = request.cookies?._digi_auth_token;
    if (cookieToken) {
      console.log('✅ Found token in cookie');
      return cookieToken;
    }

    console.log('❌ No token found');
    return undefined;
  }
}