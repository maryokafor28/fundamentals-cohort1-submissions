import { Controller, Post } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';

@Controller('reset')
export class CompleteResetController {
  constructor(private readonly productDB: ProductRepository) {}

  @Post('replace-all-products')
  async replaceAllProducts() {
    try {
      console.log('🗑️ Removing all existing products...');
      
      // Step 1: Delete ALL existing products
      const existingProducts = await this.productDB.find({}, { skip: 0, limit: 1000 });
      for (const product of existingProducts.products) {
        await this.productDB.findOneAndDelete({ _id: product._id });
      }
      console.log(`✅ Deleted ${existingProducts.totalProductCount} existing products`);

      // Step 2: Create fresh shoe products with working images
      const shoeProducts = [
        {
          productName: "Nike Air Force 1 '07",
          description: "The radiance lives on in the Nike Air Force 1 '07, the basketball original that puts a fresh spin on what you know best: durably stitched overlays, clean finishes and the perfect amount of flash to make you shine.",
          image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-shoes-WrLlWX.png",
          category: "Application Software",
          platformType: "Windows",
          baseType: "Computer",
          productUrl: "https://nike.com/air-force-1",
          downloadUrl: "https://nike.com/air-force-1/download",
          avgRating: 4.8,
          highlights: ["Classic basketball shoe", "Durable leather upper", "Air-Sole unit cushioning", "Rubber outsole"],
          requirementSpecification: [
            { name: "Material", value: "Leather" },
            { name: "Sole", value: "Rubber" },
            { name: "Closure", value: "Lace-up" }
          ],
          skuDetails: [{
            skuName: "Size 40-45",
            price: 45000,
            validity: 365,
            lifetime: true,
            stripePriceId: "price_nike_af1"
          }],
          stripeProductId: "prod_nike_af1"
        },
        {
          productName: "Adidas Ultraboost 22",
          description: "Made with a series of recycled materials, this upper features at least 50% recycled content. This product represents just one of our solutions to help end plastic waste.",
          image: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800f67317_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg",
          category: "Application Software",
          platformType: "Windows",
          baseType: "Computer",
          productUrl: "https://adidas.com/ultraboost-22",
          downloadUrl: "https://adidas.com/ultraboost-22/download",
          avgRating: 4.7,
          highlights: ["BOOST midsole", "Primeknit upper", "Continental rubber outsole", "Responsive cushioning"],
          requirementSpecification: [
            { name: "Material", value: "Primeknit" },
            { name: "Technology", value: "BOOST" },
            { name: "Sole", value: "Continental Rubber" }
          ],
          skuDetails: [{
            skuName: "Size 39-46",
            price: 52000,
            validity: 365,
            lifetime: true,
            stripePriceId: "price_adidas_ultraboost"
          }],
          stripeProductId: "prod_adidas_ultraboost"
        },
        {
          productName: "Converse Chuck Taylor All Star",
          description: "The Converse Chuck Taylor All Star sneaker is the most iconic sneaker in the world, recognized for its unmistakable silhouette, star-centered ankle patch and cultural authenticity.",
          image: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw2c8aa866/images/a_107/M7650_A_107X1.jpg?sw=964",
          category: "Application Software",
          platformType: "Windows",
          baseType: "Computer",
          productUrl: "https://converse.com/chuck-taylor-all-star",
          downloadUrl: "https://converse.com/chuck-taylor-all-star/download",
          avgRating: 4.6,
          highlights: ["Iconic design", "Canvas upper", "Rubber toe cap", "Timeless style"],
          requirementSpecification: [
            { name: "Material", value: "Canvas" },
            { name: "Sole", value: "Rubber" },
            { name: "Style", value: "High-top" }
          ],
          skuDetails: [{
            skuName: "Size 36-44",
            price: 28000,
            validity: 365,
            lifetime: true,
            stripePriceId: "price_converse_chuck"
          }],
          stripeProductId: "prod_converse_chuck"
        },
        {
          productName: "Vans Old Skool",
          description: "The Vans Old Skool was our first footwear design to showcase the famous Vans Sidestripe—although back then it was just a simple doodle drawn by founder Paul Van Doren.",
          image: "https://images.vans.com/is/image/Vans/D3HY28-HERO?$583x583$",
          category: "Application Software",
          platformType: "Windows",
          baseType: "Computer",
          productUrl: "https://vans.com/old-skool",
          downloadUrl: "https://vans.com/old-skool/download",
          avgRating: 4.5,
          highlights: ["Iconic side stripe", "Durable suede and canvas", "Signature waffle outsole", "Padded collar"],
          requirementSpecification: [
            { name: "Material", value: "Suede/Canvas" },
            { name: "Sole", value: "Waffle Rubber" },
            { name: "Style", value: "Low-top" }
          ],
          skuDetails: [{
            skuName: "Size 38-46",
            price: 35000,
            validity: 365,
            lifetime: true,
            stripePriceId: "price_vans_oldskool"
          }],
          stripeProductId: "prod_vans_oldskool"
        },
        {
          productName: "Puma Suede Classic",
          description: "From the basketball courts to the streets, the Puma Suede has been changing the game for over 50 years. This classic silhouette features a soft suede upper and a comfortable rubber sole.",
          image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/374915/25/sv01/fnd/PNA/fmt/png/Suede-Classic-XXI-Sneakers",
          category: "Application Software",
          platformType: "Windows",
          baseType: "Computer",
          productUrl: "https://puma.com/suede-classic",
          downloadUrl: "https://puma.com/suede-classic/download",
          avgRating: 4.4,
          highlights: ["Soft suede upper", "Classic silhouette", "Rubber outsole", "Comfortable fit"],
          requirementSpecification: [
            { name: "Material", value: "Suede" },
            { name: "Sole", value: "Rubber" },
            { name: "Style", value: "Low-top" }
          ],
          skuDetails: [{
            skuName: "Size 37-45",
            price: 32000,
            validity: 365,
            lifetime: true,
            stripePriceId: "price_puma_suede"
          }],
          stripeProductId: "prod_puma_suede"
        }
      ];

      const createdProducts: any[] = [];
      
      for (const productData of shoeProducts) {
        try {
          const product = await this.productDB.create(productData as any);
          
          // Add 15 licenses for each product to ensure stock
          for (let i = 0; i < 15; i++) {
            await this.productDB.createLicense(
              String((product as any)._id),
              String((product as any).skuDetails[0]._id),
              `LICENSE-${productData.productName.replace(/\s+/g, '').toUpperCase()}-${i + 1}-${Date.now()}`
            );
          }
          
          createdProducts.push({
            id: (product as any)._id,
            name: product.productName,
            price: product.skuDetails[0].price,
            image: product.image,
            stock: 15
          });
          
          console.log(`✅ Created: ${productData.productName} with 15 licenses`);
        } catch (error) {
          console.error(`❌ Failed to create ${productData.productName}:`, error.message);
        }
      }

      return {
        success: true,
        message: `Database completely reset! Removed all old products and created ${createdProducts.length} new shoe products with working images.`,
        oldProductsRemoved: existingProducts.totalProductCount,
        newProductsCreated: createdProducts.length,
        products: createdProducts,
        note: "All products now have working images and 15 units in stock each. Frontend should display new products immediately."
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}