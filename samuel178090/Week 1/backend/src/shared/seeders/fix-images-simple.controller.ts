import { Controller, Post, Get, Param } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';

@Controller('fix')
export class FixImagesSimpleController {
  constructor(private readonly productDB: ProductRepository) {}

  @Post('all-images')
  async fixAllImages() {
    try {
      const products = await this.productDB.find({}, { skip: 0, limit: 50 });
      
      const workingImages = [
        'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Shoe+1',
        'https://via.placeholder.com/400x400/4ECDC4/FFFFFF?text=Shoe+2',
        'https://via.placeholder.com/400x400/45B7D1/FFFFFF?text=Shoe+3',
        'https://via.placeholder.com/400x400/96CEB4/FFFFFF?text=Shoe+4',
        'https://via.placeholder.com/400x400/FFEAA7/000000?text=Shoe+5',
        'https://via.placeholder.com/400x400/DDA0DD/FFFFFF?text=Shoe+6',
        'https://via.placeholder.com/400x400/98D8C8/FFFFFF?text=Shoe+7',
        'https://via.placeholder.com/400x400/F7DC6F/000000?text=Shoe+8',
        'https://via.placeholder.com/400x400/BB8FCE/FFFFFF?text=Shoe+9',
        'https://via.placeholder.com/400x400/85C1E9/FFFFFF?text=Shoe+10'
      ];

      let updated = 0;
      
      for (let i = 0; i < products.products.length && i < workingImages.length; i++) {
        const product = products.products[i];
        
        await this.productDB.findOneAndUpdate(
          { _id: product._id },
          { image: workingImages[i] }
        );
        
        updated++;
        console.log(`✅ Updated image for product ${i + 1}`);
      }
      
      return {
        success: true,
        message: `Updated ${updated} product images with working URLs`,
        updated
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('check/:id')
  async checkProduct(@Param('id') id: string) {
    try {
      const product = await this.productDB.findOne({ _id: id });
      if (!product) {
        return { found: false, message: 'Product not found' };
      }
      
      return {
        found: true,
        product: {
          id: (product as any)._id,
          name: product.productName,
          description: product.description,
          image: product.image,
          price: product.skuDetails?.[0]?.price
        }
      };
    } catch (error) {
      return { error: error.message };
    }
  }
}