// Load .env variables first
import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig from './config/config';
import { TransformationInterceptor } from './responseinterceptor';
import cookieParser from 'cookie-parser';
import { NextFunction, Request, Response } from 'express';
import csurf from 'csurf';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });

  // Serve static files FIRST (before other middleware)
  const express = require('express');
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:', 'https://images.unsplash.com', 'http://localhost:3100'],
        },
      },
    }),
  );

  // CORS
  app.enableCors({
    origin: [appConfig.frontend.baseUrl, 'http://localhost:3000', 'https://qdacf.netlify.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-TOKEN'],
  });



  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Cookie parser
  app.use(cookieParser());

  // CSRF middleware
  const csrfMiddleware = csurf({
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    },
  });

  // Paths that don't require CSRF protection
  const ROOT_IGNORED_PATHS = [
    '/csrf-token',
    '/uploads',
    '/api/v1/users/login',
    '/api/v1/users/logout',
    '/api/v1/users',
    '/api/v1/users/verify-email',
    '/api/v1/users/send-otp',
    '/api/v1/users/forgot-password',
    '/api/v1/auth/refresh',
    '/api/v1/health',
    '/api/v1/seed',
    '/api/v1/orders',
    '/api/v1/orders/checkout',
    '/api/v1/products',
  ];

  // Apply CSRF middleware conditionally
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Debug log
    console.log('Request path:', req.path, 'Method:', req.method);
    
    // Skip CSRF for ignored paths or GET requests
    if (req.method === 'GET' || ROOT_IGNORED_PATHS.some(path => req.path === path || req.path.startsWith(path))) {
      console.log('Skipping CSRF for:', req.path);
      return next();
    }
    
    console.log('Applying CSRF for:', req.path);
    return csrfMiddleware(req, res, next);
  });

  // Global interceptors
  app.useGlobalInterceptors(new TransformationInterceptor());

  // API prefix - exclude csrf-token from the global prefix
  app.setGlobalPrefix(appConfig.appPrefix, {
    exclude: ['csrf-token'],
  });

  // Swagger
  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Microservice API')
      .setDescription('E-commerce microservice API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .addCookieAuth('_digi_auth_token')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = parseInt(process.env.PORT || appConfig.port, 10) || 3100;
  await app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
    console.log(`API docs: http://localhost:${port}/api/docs`);
    console.log(`CSRF token endpoint: http://localhost:${port}/csrf-token`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});