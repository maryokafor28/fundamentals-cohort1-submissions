import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/shared/repositories/product.repository';
import { Products } from 'src/shared/schema/products';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductQueryDto } from './dto/get-product-query-dto';
import appConfig from '../config/config';
import { unlinkSync } from 'fs';
import { ProductSkuDto, ProductSkuDtoArr } from './dto/product-sku.dto';
import { OrdersRepository } from 'src/shared/repositories/order.repository';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(ProductRepository) private readonly productDB: ProductRepository,
    @Inject(OrdersRepository) private readonly orderDB: OrdersRepository,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<{
    message: string;
    result: Products;
    success: boolean;
  }> {
    try {
      if (!createProductDto.stripeProductId) {
        createProductDto.stripeProductId = 'prod_' + Date.now();
      }

      const createdProductInDB = await this.productDB.create(createProductDto);
      return {
        message: 'Product created successfully',
        result: createdProductInDB,
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAllProducts(query: GetProductQueryDto) {
    try {
      let callForHomePage = false;
      if (query.homepage) {
        callForHomePage = true;
      }
      delete query.homepage;
      
      if (callForHomePage) {
        const products = await this.productDB.findProductWithGroupBy();
        const productsWithInventory = await this.addInventoryInfo(products);
        return {
          message:
            products.length > 0
              ? 'Products fetched successfully'
              : 'No products found',
          result: productsWithInventory,
          success: true,
        };
      }
      
      const skip = parseInt(query.offset as string) || 0;
      const limit = parseInt(query.limit as string) || 10;
      
      const { totalProductCount, products } = await this.productDB.find(
        query,
        { skip, limit },
      );
      
      const productsWithInventory = await this.addInventoryInfo(products);
      
      return {
        message:
          products.length > 0
            ? 'Products fetched successfully'
            : 'No products found',
        result: {
          metadata: {
            skip,
            limit,
            total: totalProductCount,
            pages: Math.ceil(totalProductCount / limit),
          },
          products: productsWithInventory,
        },
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  private async addInventoryInfo(products: any[]): Promise<any[]> {
    const productsWithInventory: any[] = [];
    
    for (const product of products) {
      const productWithInventory = { ...product };
      
      if (product.skuDetails && Array.isArray(product.skuDetails)) {
        productWithInventory.skuDetails = await Promise.all(
          product.skuDetails.map(async (sku: any) => {
            const availableLicenses = await this.productDB.findLicense({
              productSku: String(sku._id),
              isSold: false,
            });
            
            return {
              ...sku,
              availableStock: availableLicenses.length,
              inStock: availableLicenses.length > 0,
            };
          })
        );
      }
      
      productsWithInventory.push(productWithInventory);
    }
    
    return productsWithInventory;
  }

  async findOneProduct(id: string): Promise<{
    message: string;
    result: { product: Products; relatedProducts: Products[] };
    success: boolean;
  }> {
    try {
      const product = await this.productDB.findOne({ _id: id });
      if (!product) {
        throw new Error('Product does not exist');
      }
      
      const productWithInventory = (await this.addInventoryInfo([product]))[0];
      
      const relatedProducts: Products[] =
        await this.productDB.findRelatedProducts({
          category: product.category,
          _id: { $ne: id },
        });
      
      const relatedProductsWithInventory = await this.addInventoryInfo(relatedProducts);

      return {
        message: 'Product fetched successfully',
        result: { 
          product: productWithInventory, 
          relatedProducts: relatedProductsWithInventory 
        },
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(
    id: string,
    updateProductDto: CreateProductDto,
  ): Promise<{
    message: string;
    result: Products;
    success: boolean;
  }> {
    try {
      const productExist = await this.productDB.findOne({ _id: id });
      if (!productExist) {
        throw new Error('Product does not exist');
      }
      const updatedProduct = await this.productDB.findOneAndUpdate(
        { _id: id },
        updateProductDto,
      );
      if (!updatedProduct) {
        throw new Error('Failed to update product');
      }
      const productWithInventory = (await this.addInventoryInfo([updatedProduct]))[0];
      return {
        message: 'Product updated successfully',
        result: productWithInventory,
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async removeProduct(id: string): Promise<{
    message: string;
    success: boolean;
    result: null;
  }> {
    try {
      const productExist = await this.productDB.findOne({ _id: id });
      if (!productExist) {
        throw new Error('Product does not exist');
      }
      await this.productDB.findOneAndDelete({ _id: id });
      return {
        message: 'Product deleted successfully',
        success: true,
        result: null,
      };
    } catch (error) {
      throw error;
    }
  }

  async uploadProductImage(
    id: string,
    file: any,
  ): Promise<{
    message: string;
    success: boolean;
    result: string;
  }> {
    try {
      const product = await this.productDB.findOne({ _id: id });
      if (!product) {
        throw new Error('Product does not exist');
      }

      // Generate proper backend image URL
      const imageUrl = `${appConfig.backend.baseUrl}/uploads/${file.filename}`;
      
      await this.productDB.findOneAndUpdate(
        { _id: id },
        {
          image: imageUrl,
        },
      );

      return {
        message: 'Image uploaded successfully',
        success: true,
        result: imageUrl,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateProductSku(productId: string, data: ProductSkuDtoArr) {
    try {
      const product = await this.productDB.findOne({ _id: productId });
      if (!product) {
        throw new Error('Product does not exist');
      }

      const skuCode = Math.random().toString(36).substring(2, 5) + Date.now();
      for (let i = 0; i < data.skuDetails.length; i++) {
        if (!data.skuDetails[i].stripePriceId) {
          data.skuDetails[i].stripePriceId = 'price_' + Date.now() + i;
        }
        data.skuDetails[i].skuCode = skuCode;
      }

      await this.productDB.findOneAndUpdate(
        { _id: productId },
        { $push: { skuDetails: data.skuDetails } },
      );

      return {
        message: 'Product sku updated successfully',
        success: true,
        result: null,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateProductSkuById(
    productId: string,
    skuId: string,
    data: ProductSkuDto,
  ) {
    try {
      const product = await this.productDB.findOne({ _id: productId });
      if (!product) {
        throw new Error('Product does not exist');
      }

      const sku = product.skuDetails.find((sku) => String((sku as any)._id) === skuId);
      if (!sku) {
        throw new Error('Sku does not exist');
      }

      await this.productDB.findOneAndUpdate(
        { _id: productId, 'skuDetails._id': skuId },
        { $set: { 'skuDetails.$': data } },
      );

      return {
        message: 'Product sku updated successfully',
        success: true,
        result: null,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteProductSkuById(productId: string, skuId: string) {
    try {
      const product = await this.productDB.findOne({ _id: productId });
      if (!product) {
        throw new Error('Product does not exist');
      }

      await this.productDB.findOneAndUpdate(
        { _id: productId },
        { $pull: { skuDetails: { _id: skuId } } },
      );

      return {
        message: 'Product sku deleted successfully',
        success: true,
        result: null,
      };
    } catch (error) {
      throw error;
    }
  }

  async addProductSkuLicense(
    productId: string,
    skuId: string,
    licenseKey: string,
  ) {
    try {
      const productDetails = await this.productDB.findOne({ _id: productId });
      if (!productDetails) {
        throw new BadRequestException('Product not found');
      }

      const sku = productDetails.skuDetails.find(
        (sku) => String((sku as any)._id) === skuId,
      );
      if (!sku) {
        throw new BadRequestException('SKU not found');
      }

      const license = await this.productDB.createLicense(
        productId,
        String((sku as any)._id),
        licenseKey,
      );

      return {
        message: 'License added successfully',
        success: true,
        result: license,
      };
    } catch (error) {
      throw error;
    }
  }

  async removeProductSkuLicense(licenseId: string) {
    try {
      await this.productDB.removeLicense({ _id: licenseId });
      return {
        message: 'License removed successfully',
        success: true,
        result: null,
      };
    } catch (error) {
      throw error;
    }
  }

  async getProductSkuLicenses(productId: string, skuId: string) {
    try {
      const licenses = await this.productDB.findLicense({
        productSku: skuId,
      });
      return {
        message: 'Licenses fetched successfully',
        success: true,
        result: licenses,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateProductSkuLicense(
    productId: string,
    skuId: string,
    licenseKeyId: string,
    licenseKey: string,
  ) {
    try {
      await this.productDB.updateLicense(
        { _id: licenseKeyId },
        { licenseKey },
      );
      return {
        message: 'License updated successfully',
        success: true,
        result: null,
      };
    } catch (error) {
      throw error;
    }
  }

  async addProductReview(
    productId: string,
    rating: number,
    review: string,
    user: any,
  ) {
    try {
      const reviewData = {
        customerId: user._id,
        customerName: user.name,
        rating,
        feedbackMsg: review,
      };

      await this.productDB.findOneAndUpdate(
        { _id: productId },
        { $push: { feedbackDetails: reviewData } },
      );

      return {
        message: 'Review added successfully',
        success: true,
        result: null,
      };
    } catch (error) {
      throw error;
    }
  }

  async removeProductReview(productId: string, reviewId: string) {
    try {
      await this.productDB.findOneAndUpdate(
        { _id: productId },
        { $pull: { feedbackDetails: { _id: reviewId } } },
      );

      return {
        message: 'Review removed successfully',
        success: true,
        result: null,
      };
    } catch (error) {
      throw error;
    }
  }

  async getInventoryStatus() {
    try {
      const products = await this.productDB.find({}, { skip: 0, limit: 100 });
      const inventoryStatus: any[] = [];

      for (const product of products.products) {
        const productStatus: any = {
          productId: product._id,
          productName: product.productName,
          description: product.description,
          category: product.category,
          skus: [] as any[],
        };

        if (product.skuDetails && Array.isArray(product.skuDetails)) {
          for (const sku of product.skuDetails) {
            const availableLicenses = await this.productDB.findLicense({
              productSku: String(sku._id),
              isSold: false,
            });

            productStatus.skus.push({
              skuId: sku._id,
              skuName: sku.skuName,
              price: sku.price,
              availableStock: availableLicenses.length,
              inStock: availableLicenses.length > 0,
              status: availableLicenses.length > 0 ? 'Available' : 'Out of Stock',
            });
          }
        }

        inventoryStatus.push(productStatus);
      }

      return {
        success: true,
        message: 'Inventory status retrieved successfully',
        result: inventoryStatus,
      };
    } catch (error) {
      throw error;
    }
  }

  async addSkusToProducts() {
    try {
      const products = await this.productDB.find({}, { skip: 0, limit: 100 });
      let updatedCount = 0;

      for (const product of products.products) {
        if (!product.skuDetails || product.skuDetails.length === 0) {
          const skuDetails = [{
            skuName: 'Standard License',
            price: Math.floor(Math.random() * 200) + 50,
            validity: 365,
            lifetime: false,
            stripePriceId: 'price_' + Date.now() + Math.random().toString(36).substring(2, 5),
            skuCode: Math.random().toString(36).substring(2, 5) + Date.now()
          }];

          await this.productDB.findOneAndUpdate(
            { _id: product._id },
            { skuDetails }
          );
          updatedCount++;
        }
      }

      return {
        success: true,
        message: `Added SKUs to ${updatedCount} products`,
        result: { updatedCount }
      };
    } catch (error) {
      throw error;
    }
  }

  async addSampleImages() {
    try {
      const products = await this.productDB.find({}, { skip: 0, limit: 100 });
      let updatedCount = 0;

      const sampleImages = [
        'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400',
        'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400',
        'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'
      ];

      for (const product of products.products) {
        if (!product.image || product.image.includes('placeholder')) {
          const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
          
          await this.productDB.findOneAndUpdate(
            { _id: product._id },
            { image: randomImage }
          );
          updatedCount++;
        }
      }

      return {
        success: true,
        message: `Added sample images to ${updatedCount} products`,
        result: { updatedCount }
      };
    } catch (error) {
      throw error;
    }
  }

  async debugProducts() {
    try {
      const products = await this.productDB.find({}, { skip: 0, limit: 5 });
      return {
        success: true,
        message: 'Debug product data',
        result: products.products.map(p => ({
          id: p._id,
          name: p.productName,
          image: p.image,
          hasSkuDetails: p.skuDetails?.length > 0,
          skuCount: p.skuDetails?.length || 0
        }))
      };
    } catch (error) {
      throw error;
    }
  }

  async forceFixImages() {
    try {
      const products = await this.productDB.find({}, { skip: 0, limit: 100 });
      let updatedCount = 0;

      const sampleImages = [
        'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400',
        'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400',
        'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'
      ];

      for (const product of products.products) {
        const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
        
        await this.productDB.findOneAndUpdate(
          { _id: product._id },
          { image: randomImage }
        );
        updatedCount++;
      }

      return {
        success: true,
        message: `Force updated images for ${updatedCount} products`,
        result: { updatedCount }
      };
    } catch (error) {
      throw error;
    }
  }

  async addShoeProducts() {
    try {
      const shoeProducts = [
        {
          productName: 'Nike Air Max 270',
          description: 'Comfortable running shoes with Air Max technology for all-day comfort.',
          category: 'Application Software',
          platformType: 'Windows',
          baseType: 'Computer',
          productUrl: 'https://nike.com/air-max-270',
          downloadUrl: 'https://nike.com/downloads',
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
          highlights: ['Air Max cushioning', 'Breathable mesh', 'Durable rubber sole', 'Lightweight design'],
          requirementSpecification: [{ Size: 'US 7-12' }, { Color: 'Multiple colors available' }],
          stripeProductId: 'prod_nike_270'
        },
        {
          productName: 'Adidas Ultraboost 22',
          description: 'Premium running shoes with Boost midsole technology.',
          category: 'Application Software',
          platformType: 'Windows',
          baseType: 'Computer',
          productUrl: 'https://adidas.com/ultraboost',
          downloadUrl: 'https://adidas.com/downloads',
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
          highlights: ['Boost technology', 'Primeknit upper', 'Continental rubber', 'Energy return'],
          requirementSpecification: [{ Size: 'US 6-13' }, { Width: 'Regular and wide available' }],
          stripeProductId: 'prod_adidas_ultra'
        },
        {
          productName: 'Converse Chuck Taylor',
          description: 'Classic canvas sneakers with timeless design.',
          category: 'Application Software',
          platformType: 'Mac',
          baseType: 'Computer',
          productUrl: 'https://converse.com/chuck-taylor',
          downloadUrl: 'https://converse.com/downloads',
          image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400',
          highlights: ['Canvas upper', 'Rubber toe cap', 'Classic design', 'Versatile style'],
          requirementSpecification: [{ Size: 'US 5-12' }, { Material: '100% Canvas' }],
          stripeProductId: 'prod_converse_chuck'
        },
        {
          productName: 'Vans Old Skool',
          description: 'Iconic skate shoes with signature side stripe.',
          category: 'Application Software',
          platformType: 'Linux',
          baseType: 'Computer',
          productUrl: 'https://vans.com/old-skool',
          downloadUrl: 'https://vans.com/downloads',
          image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400',
          highlights: ['Suede and canvas', 'Waffle outsole', 'Padded collar', 'Signature stripe'],
          requirementSpecification: [{ Size: 'US 4-13' }, { Style: 'Low-top design' }],
          stripeProductId: 'prod_vans_old'
        },
        {
          productName: 'Puma RS-X',
          description: 'Retro-futuristic running shoes with bold design.',
          category: 'Application Software',
          platformType: 'Windows',
          baseType: 'Computer',
          productUrl: 'https://puma.com/rs-x',
          downloadUrl: 'https://puma.com/downloads',
          image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
          highlights: ['RS cushioning', 'Mixed materials', 'Bold colorways', 'Chunky silhouette'],
          requirementSpecification: [{ Size: 'US 6-12' }, { Design: 'Retro-futuristic' }],
          stripeProductId: 'prod_puma_rsx'
        },
        {
          productName: 'New Balance 990v5',
          description: 'Premium made-in-USA running shoes with superior comfort.',
          category: 'Application Software',
          platformType: 'Mac',
          baseType: 'Computer',
          productUrl: 'https://newbalance.com/990v5',
          downloadUrl: 'https://newbalance.com/downloads',
          image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400',
          highlights: ['Made in USA', 'ENCAP midsole', 'Premium materials', 'Classic styling'],
          requirementSpecification: [{ Size: 'US 7-13' }, { Origin: 'Made in USA' }],
          stripeProductId: 'prod_nb_990'
        },
        {
          productName: 'Jordan Air Force 1',
          description: 'Iconic basketball shoes with timeless appeal.',
          category: 'Application Software',
          platformType: 'Windows',
          baseType: 'Computer',
          productUrl: 'https://jordan.com/air-force-1',
          downloadUrl: 'https://jordan.com/downloads',
          image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400',
          highlights: ['Air cushioning', 'Leather upper', 'Rubber outsole', 'Classic design'],
          requirementSpecification: [{ Size: 'US 6-14' }, { Material: 'Premium leather' }],
          stripeProductId: 'prod_jordan_af1'
        },
        {
          productName: 'Reebok Classic Leather',
          description: 'Vintage-inspired sneakers with soft leather construction.',
          category: 'Application Software',
          platformType: 'Linux',
          baseType: 'Computer',
          productUrl: 'https://reebok.com/classic-leather',
          downloadUrl: 'https://reebok.com/downloads',
          image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400',
          highlights: ['Soft leather', 'EVA midsole', 'High abrasion rubber', 'Vintage style'],
          requirementSpecification: [{ Size: 'US 5-12' }, { Style: 'Low-top classic' }],
          stripeProductId: 'prod_reebok_classic'
        },
        {
          productName: 'ASICS Gel-Kayano 29',
          description: 'Stability running shoes with advanced gel cushioning.',
          category: 'Application Software',
          platformType: 'Mac',
          baseType: 'Computer',
          productUrl: 'https://asics.com/gel-kayano',
          downloadUrl: 'https://asics.com/downloads',
          image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
          highlights: ['GEL technology', 'FlyteFoam midsole', 'Stability support', 'Breathable mesh'],
          requirementSpecification: [{ Size: 'US 6-13' }, { Type: 'Stability running' }],
          stripeProductId: 'prod_asics_kayano'
        }
      ];

      let addedCount = 0;
      
      for (const shoeData of shoeProducts) {
        try {
          const productData = {
            ...shoeData,
            skuDetails: []
          };
          
          const createdProduct = await this.productDB.create(productData);
          
          // Add SKU details
          const skuDetails = [{
            skuName: 'Standard',
            price: Math.floor(Math.random() * 150) + 50,
            validity: 365,
            lifetime: true,
            stripePriceId: 'price_' + Date.now() + Math.random().toString(36).substring(2, 5),
            skuCode: Math.random().toString(36).substring(2, 5) + Date.now()
          }];
          
          await this.productDB.findOneAndUpdate(
            { _id: (createdProduct as any)._id },
            { skuDetails }
          );
          
          addedCount++;
        } catch (error) {
          console.error(`Error adding ${shoeData.productName}:`, error);
        }
      }

      return {
        success: true,
        message: `Added ${addedCount} shoe products with images and SKU details`,
        result: { count: addedCount }
      };
    } catch (error) {
      throw error;
    }
  }
}