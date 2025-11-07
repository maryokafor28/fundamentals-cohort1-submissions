import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { Products } from '../schema/products';
import { License } from '../schema/license';

interface QueryOptions {
  sort?: Record<string, any>;
  limit?: number;
  skip?: number;
}

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Products.name) private readonly productModel: Model<Products>,
    @InjectModel(License.name) private readonly licenseModel: Model<License>,
  ) {}

  async create(product: CreateProductDto): Promise<Products> {
    return this.productModel.create(product);
  }

  async findOne(query: Record<string, any>): Promise<Products | null> {
    return this.productModel.findOne(query);
  }

  async findOneAndUpdate(query: Record<string, any>, update: Record<string, any>): Promise<Products | null> {
    return this.productModel.findOneAndUpdate(query, update, { new: true });
  }

  async findOneAndDelete(query: Record<string, any>): Promise<Products | null> {
    return this.productModel.findOneAndDelete(query);
  }

  async findProductWithGroupBy(): Promise<any[]> {
    return this.productModel.aggregate([
      {
        $facet: {
          latestProducts: [{ $sort: { createdAt: -1 } }, { $limit: 4 }],
          topRatedProducts: [{ $sort: { avgRating: -1 } }, { $limit: 8 }],
        },
      },
    ]);
  }

  async find(query: Record<string, any>, options: QueryOptions): Promise<{ totalProductCount: number; products: any[] }> {
    try {
      const sortOptions = options.sort || { createdAt: -1 };
      const limitOptions = options.limit || 12;
      const skipOptions = options.skip || 0;

      const searchQuery: Record<string, any> = {};
      
      // Handle search
      if (query.search && query.search.trim()) {
        const searchTerm = query.search.trim();
        searchQuery.$or = [
          { productName: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { category: { $regex: searchTerm, $options: 'i' } },
        ];
      }
      
      // Handle other filters
      if (query.category) searchQuery.category = query.category;
      if (query.platformType) searchQuery.platformType = query.platformType;
      if (query.baseType) searchQuery.baseType = query.baseType;

      const products = await this.productModel
        .find(searchQuery)
        .sort(sortOptions)
        .skip(skipOptions)
        .limit(limitOptions)
        .lean()
        .exec();

      const totalProductCount = await this.productModel.countDocuments(searchQuery);
        
      return { totalProductCount, products };
    } catch (error) {
      console.error('Error in ProductRepository.find:', error);
      return { totalProductCount: 0, products: [] };
    }
  }

  async findRelatedProducts(query: Record<string, any>): Promise<any[]> {
    return this.productModel.aggregate([
      { $match: query },
      { $sample: { size: 4 } },
    ]);
  }

  async createLicense(product: string, productSku: string, licenseKey: string): Promise<License> {
    return this.licenseModel.create({ product, productSku, licenseKey });
  }

  async removeLicense(query: Record<string, any>): Promise<License | null> {
    return this.licenseModel.findOneAndDelete(query);
  }

  async findLicense(query: Record<string, any>, limit?: number): Promise<License[]> {
    return limit && limit > 0 
      ? this.licenseModel.find(query).limit(limit)
      : this.licenseModel.find(query);
  }

  async updateLicense(query: Record<string, any>, update: Record<string, any>): Promise<License | null> {
    return this.licenseModel.findOneAndUpdate(query, update, { new: true });
  }

  async updateLicenseMany(query: Record<string, any>, data: Record<string, any>): Promise<any> {
    return this.licenseModel.updateMany(query, data);
  }

  async deleteSku(id: string, skuId: string): Promise<any> {
    return this.productModel.updateOne(
      { _id: id },
      { $pull: { skuDetails: { _id: skuId } } },
    );
  }

  async deleteAllLicences(productId: string, skuId: string): Promise<any> {
    return productId
      ? this.licenseModel.deleteMany({ product: productId })
      : this.licenseModel.deleteMany({ productSku: skuId });
  }
}
