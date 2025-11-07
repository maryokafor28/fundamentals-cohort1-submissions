import { Controller, Post } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';

@Controller('update')
export class UpdateExistingController {
  constructor(private readonly productDB: ProductRepository) {}

  @Post('all-to-shoes')
  async updateAllToShoes() {
    try {
      const products = await this.productDB.find({}, { skip: 0, limit: 50 });
      
      const shoeData = [
        {
          name: "Oxford Classic Leather Shoes",
          description: "Premium genuine leather Oxford shoes perfect for formal occasions, business meetings, and professional settings. Crafted with attention to detail and superior comfort.",
          image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
          price: 45000
        },
        {
          name: "Brogues Wingtip Shoes", 
          description: "Elegant brogues with intricate wingtip design and decorative perforations. Perfect for semi-formal and smart casual occasions with timeless style.",
          image: "https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
          price: 52000
        },
        {
          name: "Casual Sneakers",
          description: "Comfortable and stylish casual sneakers perfect for everyday wear, weekend outings, and relaxed social gatherings. Modern design meets comfort.",
          image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
          price: 28000
        },
        {
          name: "Male Leather Sandals",
          description: "Premium leather sandals for men featuring adjustable straps and comfortable footbed. Perfect for casual outings and warm weather comfort.",
          image: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
          price: 22000
        },
        {
          name: "Male Latest Palm Slippers",
          description: "Contemporary palm slippers with modern design and superior comfort. Lightweight and breathable for ultimate relaxation and casual wear.",
          image: "https://images.pexels.com/photos/1598506/pexels-photo-1598506.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
          price: 15000
        },
        {
          name: "Soccer Football Boots",
          description: "Professional soccer boots with superior grip and ball control. Designed for optimal performance on grass fields with lightweight construction.",
          image: "https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
          price: 65000
        },
        {
          name: "Female High Heel Shoes",
          description: "Elegant high heel shoes perfect for formal events, parties, and professional occasions. Sophisticated design with comfortable heel height.",
          image: "https://images.pexels.com/photos/1598509/pexels-photo-1598509.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
          price: 38000
        },
        {
          name: "Female Casual Shoes",
          description: "Comfortable and stylish casual shoes for women. Perfect for daily wear, shopping, and casual outings with modern design and all-day comfort.",
          image: "https://images.pexels.com/photos/1598510/pexels-photo-1598510.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
          price: 32000
        },
        {
          name: "Female Heel Sandals",
          description: "Stylish heel sandals with elegant straps and comfortable heel height. Perfect for summer occasions and semi-formal events.",
          image: "https://images.pexels.com/photos/1598511/pexels-photo-1598511.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
          price: 35000
        },
        {
          name: "Female Palm Sandals",
          description: "Comfortable palm sandals for women with soft straps and cushioned sole. Perfect for beach, casual outings, and relaxed occasions.",
          image: "https://images.pexels.com/photos/1598512/pexels-photo-1598512.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
          price: 18000
        }
      ];

      let updated = 0;
      
      for (let i = 0; i < products.products.length && i < shoeData.length; i++) {
        const product = products.products[i];
        const shoe = shoeData[i];
        
        await this.productDB.findOneAndUpdate(
          { _id: product._id },
          {
            productName: shoe.name,
            description: shoe.description,
            image: shoe.image,
            'skuDetails.0.price': shoe.price
          }
        );
        
        updated++;
        console.log(`✅ Updated: ${shoe.name}`);
      }
      
      return {
        success: true,
        message: `Updated ${updated} products to shoes with working images`,
        updated
      };
    } catch (error) {
      return { error: error.message };
    }
  }
}