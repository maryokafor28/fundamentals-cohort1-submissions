import { Module } from '@nestjs/common';
import { ShoeProductsSeeder } from './shoe-products.seeder';
import { FixImagesSeeder } from './fix-images.seeder';
import { SeedController } from './seed.controller';
import { ClearAndSeedController } from './clear-and-seed.controller';
import { DebugController } from './debug.controller';
import { UpdateExistingController } from './update-existing.controller';
import { EmailTestController } from './email-test.controller';
import { UserDebugController } from './user-debug.controller';
import { FixImagesSimpleController } from './fix-images-simple.controller';
import { SimpleTestController } from './simple-test.controller';
import { ComprehensiveFixController } from './comprehensive-fix.controller';
import { QuickFixController } from './quick-fix.controller';
import { CompleteResetController } from './complete-reset.controller';
import { ProductRepository } from '../repositories/product.repository';
import { UserRepository } from '../repositories/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from '../schema/products';
import { LicenseSchema } from '../schema/license';
import { UserSchema } from '../schema/users';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Products', schema: ProductSchema },
      { name: 'License', schema: LicenseSchema },
      { name: 'Users', schema: UserSchema }
    ])
  ],
  controllers: [SeedController, ClearAndSeedController, DebugController, UpdateExistingController, EmailTestController, UserDebugController, FixImagesSimpleController, SimpleTestController, ComprehensiveFixController, QuickFixController, CompleteResetController],
  providers: [ShoeProductsSeeder, FixImagesSeeder, ProductRepository, UserRepository],
  exports: [ShoeProductsSeeder, FixImagesSeeder]
})
export class SeedersModule {}