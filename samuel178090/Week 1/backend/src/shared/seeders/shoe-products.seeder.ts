import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { categoryType, platformType, baseType } from '../schema/products';

@Injectable()
export class ShoeProductsSeeder {
  constructor(private readonly productDB: ProductRepository) {}

  async seedShoeProducts() {
    const shoeProducts = [
      {
        productName: "Oxford Classic Leather Shoes",
        description: "Premium genuine leather Oxford shoes perfect for formal occasions, business meetings, and professional settings. Crafted with attention to detail and superior comfort.",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
        category: categoryType.applicationSoftware,
        platformType: platformType.windows,
        baseType: baseType.computer,
        productUrl: "https://shoestore.com/oxford-classic",
        downloadUrl: "https://shoestore.com/oxford-classic/download",
        avgRating: 4.8,
        highlights: [
          "Genuine leather construction",
          "Classic Oxford design",
          "Professional appearance",
          "Comfortable fit",
          "Durable sole"
        ],
        requirementSpecification: [
          { name: "Material", value: "Genuine Leather" },
          { name: "Sole Type", value: "Rubber" },
          { name: "Closure", value: "Lace-up" }
        ],
        skuDetails: [
          {
            skuName: "Size 40-45",
            price: 45000,
            validity: 365,
            lifetime: true,
            stripePriceId: "price_oxford_classic"
          }
        ]
      },
      {
        productName: "Brogues Wingtip Shoes",
        description: "Elegant brogues with intricate wingtip design and decorative perforations. Perfect for semi-formal and smart casual occasions with timeless style.",
        image: "https://images.unsplash.com/photo-1582897085656-c636d006a246?w=500&h=500&fit=crop",
        category: categoryType.applicationSoftware,
        platformType: platformType.windows,
        baseType: baseType.computer,
        productUrl: "https://shoestore.com/brogues-wingtip",
        downloadUrl: "https://shoestore.com/brogues-wingtip/download",
        avgRating: 4.7,
        highlights: [
          "Wingtip design",
          "Decorative perforations",
          "Premium leather",
          "Versatile styling",
          "Comfortable padding"
        ],
        requirementSpecification: [
          { name: "Material", value: "Premium Leather" },
          { name: "Design", value: "Wingtip Brogues" },
          { name: "Sole", value: "Leather" }
        ],
        skuDetails: [
          {
            skuName: "Size 39-46",
            price: 52000,
            validity: 365,
            lifetime: true,
            stripePriceId: "price_brogues_wingtip"
          }
        ]
      },
      {
        productName: "Casual Sneakers",
        description: "Comfortable and stylish casual sneakers perfect for everyday wear, weekend outings, and relaxed social gatherings. Modern design meets comfort.",
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop",
        category: categoryType.applicationSoftware,
        platformType: platformType.windows,
        baseType: baseType.computer,
        productUrl: "https://shoestore.com/casual-sneakers",
        downloadUrl: "https://shoestore.com/casual-sneakers/download",
        avgRating: 4.6,
        highlights: [
          "Breathable material",
          "Cushioned sole",
          "Modern design",
          "All-day comfort",
          "Versatile colors"
        ],
        requirementSpecification: [
          { name: "Material", value: "Canvas/Synthetic" },
          { name: "Sole Type", value: "Rubber" },
          { name: "Style", value: "Casual" }
        ],
        skuDetails: [
          {
            skuName: "Size 38-47",
            price: 28000,
            validity: 365,
            lifetime: true,
            stripePriceId: "price_casual_sneakers"
          }
        ]
      },
      {
        productName: "Male Leather Sandals",
        description: "Premium leather sandals for men featuring adjustable straps and comfortable footbed. Perfect for casual outings and warm weather comfort.",
        image: "https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?w=500&h=500&fit=crop",
        category: categoryType.applicationSoftware,
        platformType: platformType.windows,
        baseType: baseType.computer,
        productUrl: "https://shoestore.com/male-sandals",
        downloadUrl: "https://shoestore.com/male-sandals/download",
        avgRating: 4.5,
        highlights: [
          "Genuine leather straps",
          "Adjustable fit",
          "Comfortable footbed",
          "Durable construction",
          "Casual elegance"
        ],
        requirementSpecification: [
          { name: "Material", value: "Genuine Leather" },
          { name: "Closure", value: "Adjustable Straps" },
          { name: "Sole", value: "Rubber" }
        ],
        skuDetails: [
          {
            skuName: "Size 40-46",
            price: 22000,
            validity: 365,
            lifetime: true,
            stripePriceId: "price_male_sandals"
          }
        ]
      },
      {
        productName: "Male Latest Palm Slippers",
        description: "Contemporary palm slippers with modern design and superior comfort. Lightweight and breathable for ultimate relaxation and casual wear.",
        image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&h=500&fit=crop",
        category: categoryType.applicationSoftware,
        platformType: platformType.windows,
        baseType: baseType.computer,
        productUrl: "https://shoestore.com/male-palm-slippers",
        downloadUrl: "https://shoestore.com/male-palm-slippers/download",
        avgRating: 4.4,
        highlights: [
          "Lightweight design",
          "Breathable material",
          "Modern styling",
          "Easy slip-on",
          "Comfortable sole"
        ],
        requirementSpecification: [
          { name: "Material", value: "Synthetic" },
          { name: "Style", value: "Slip-on" },
          { name: "Sole", value: "EVA" }
        ],
        skuDetails: [
          {
            skuName: "Size 39-45",
            price: 15000,
            validity: 365,
            lifetime: true,
            stripePriceId: "price_male_palm_slippers"
          }
        ]
      },
      {
        productName: "Soccer Football Boots",
        description: "Professional soccer boots with superior grip and ball control. Designed for optimal performance on grass fields with lightweight construction.",
        image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop",
        category: categoryType.applicationSoftware,
        platformType: platformType.windows,
        baseType: baseType.computer,
        productUrl: "https://shoestore.com/soccer-boots",
        downloadUrl: "https://shoestore.com/soccer-boots/download",
        avgRating: 4.9,
        highlights: [
          "Professional grade",
          "Superior grip studs",
          "Lightweight design",
          "Enhanced ball control",
          "Durable construction"
        ],
        requirementSpecification: [
          { name: "Material", value: "Synthetic Leather" },
          { name: "Studs", value: "Molded" },
          { name: "Surface", value: "Grass" }
        ],
        skuDetails: [
          {
            skuName: "Size 38-46",
            price: 65000,
            validity: 365,
            lifetime: true,
            stripePriceId: "price_soccer_boots"
          }
        ]
      },
      {
        productName: "Female High Heel Shoes",
        description: "Elegant high heel shoes perfect for formal events, parties, and professional occasions. Sophisticated design with comfortable heel height.",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop",
        category: categoryType.applicationSoftware,
        platformType: platformType.windows,
        baseType: baseType.computer,
        productUrl: "https://shoestore.com/female-heels",
        downloadUrl: "https://shoestore.com/female-heels/download",
        avgRating: 4.7,
        highlights: [
          "Elegant design",
          "Comfortable heel height",
          "Premium materials",
          "Sophisticated look",
          "Versatile styling"
        ],
        requirementSpecification: [
          { name: "Material", value: "Synthetic Leather" },
          { name: "Heel Height", value: "3-4 inches" },
          { name: "Closure", value: "Slip-on" }
        ],
        skuDetails: [
          {
            skuName: "Size 36-42",
            price: 38000,
            validity: 365,
            lifetime: true,
            stripePriceId: "price_female_heels"
          }
        ]
      },
      {
        productName: "Female Casual Shoes",
        description: "Comfortable and stylish casual shoes for women. Perfect for daily wear, shopping, and casual outings with modern design and all-day comfort.",
        image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=500&h=500&fit=crop",
        category: categoryType.applicationSoftware,
        platformType: platformType.windows,
        baseType: baseType.computer,
        productUrl: "https://shoestore.com/female-casual",
        downloadUrl: "https://shoestore.com/female-casual/download",
        avgRating: 4.6,
        highlights: [
          "All-day comfort",
          "Stylish design",
          "Breathable material",
          "Flexible sole",
          "Modern colors"
        ],
        requirementSpecification: [
          { name: "Material", value: "Canvas/Leather" },
          { name: "Style", value: "Casual" },
          { name: "Sole", value: "Rubber" }
        ],
        skuDetails: [
          {
            skuName: "Size 35-41",
            price: 32000,
            validity: 365,
            lifetime: true,
            stripePriceId: "price_female_casual"
          }
        ]
      },
      {
        productName: "Female Heel Sandals",
        description: "Stylish heel sandals with elegant straps and comfortable heel height. Perfect for summer occasions and semi-formal events.",
        image: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=500&h=500&fit=crop",
        category: categoryType.applicationSoftware,
        platformType: platformType.windows,
        baseType: baseType.computer,
        productUrl: "https://shoestore.com/female-heel-sandals",
        downloadUrl: "https://shoestore.com/female-heel-sandals/download",
        avgRating: 4.5,
        highlights: [
          "Elegant straps",
          "Comfortable heel",
          "Summer perfect",
          "Stylish design",
          "Quality materials"
        ],
        requirementSpecification: [
          { name: "Material", value: "Synthetic" },
          { name: "Heel Height", value: "2-3 inches" },
          { name: "Straps", value: "Adjustable" }
        ],
        skuDetails: [
          {
            skuName: "Size 36-41",
            price: 35000,
            validity: 365,
            lifetime: true,
            stripePriceId: "price_female_heel_sandals"
          }
        ]
      },
      {
        productName: "Female Palm Sandals",
        description: "Comfortable palm sandals for women with soft straps and cushioned sole. Perfect for beach, casual outings, and relaxed occasions.",
        image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=500&fit=crop",
        category: categoryType.applicationSoftware,
        platformType: platformType.windows,
        baseType: baseType.computer,
        productUrl: "https://shoestore.com/female-palm-sandals",
        downloadUrl: "https://shoestore.com/female-palm-sandals/download",
        avgRating: 4.4,
        highlights: [
          "Soft comfortable straps",
          "Cushioned sole",
          "Beach perfect",
          "Lightweight design",
          "Easy to wear"
        ],
        requirementSpecification: [
          { name: "Material", value: "Synthetic" },
          { name: "Style", value: "Casual" },
          { name: "Sole", value: "EVA" }
        ],
        skuDetails: [
          {
            skuName: "Size 35-40",
            price: 18000,
            validity: 365,
            lifetime: true,
            stripePriceId: "price_female_palm_sandals"
          }
        ]
      }
    ];

    console.log('🦶 Starting shoe products seeding...');
    
    for (const product of shoeProducts) {
      try {
        const existingProduct = await this.productDB.findOne({ 
          productName: product.productName 
        });
        
        if (!existingProduct) {
          const createdProduct = await this.productDB.create({
            ...product,
            stripeProductId: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
          } as any);
          
          for (let i = 0; i < 5; i++) {
            await this.productDB.createLicense(
              String((createdProduct as any)._id),
              String((createdProduct as any).skuDetails[0]._id),
              `LICENSE-${product.productName.replace(/\s+/g, '').toUpperCase()}-${i + 1}-${Date.now()}`
            );
          }
          
          console.log(`✅ Created: ${product.productName}`);
        } else {
          console.log(`⏭️  Skipped: ${product.productName} (already exists)`);
        }
      } catch (error) {
        console.error(`❌ Error creating ${product.productName}:`, error.message);
      }
    }
    
    console.log('🎉 Shoe products seeding completed!');
  }
}