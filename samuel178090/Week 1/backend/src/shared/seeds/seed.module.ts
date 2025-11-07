import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedController } from './seed.controller';
import { SeedDataService } from './seed-data.service';
import { Users, UserSchema } from '../schema/users';
import { Products, ProductSchema } from '../schema/products';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Users.name, schema: UserSchema },
      { name: Products.name, schema: ProductSchema },
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedDataService],
})
export class SeedModule {}