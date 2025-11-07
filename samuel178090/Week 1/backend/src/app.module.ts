import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AllExceptionFilter } from './httpExceptionFilter';

import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { SeedModule } from './shared/seeds/seed.module';
import { SeedersModule } from './shared/seeders/seeders.module';
import { CsrfController } from './csrf.controller';

import { config } from 'dotenv';
config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL!, {
      connectionFactory: (connection) => {
        connection.on('connected', () => console.log('🟢 Database connected successfully'));
        connection.on('disconnected', () => console.log('🔴 Database disconnected'));
        connection.on('error', (error) => console.error('❌ Database connection error:', error));
        return connection;
      },
    }),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '24h',
        issuer: 'mservice-api',
        audience: 'mservice-frontend',
      },
    }),

    ThrottlerModule.forRoot(),

    UsersModule,
    ProductsModule,
    OrdersModule,
    SeedModule,
    SeedersModule,
  ],

  controllers: [AppController, CsrfController],

  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}