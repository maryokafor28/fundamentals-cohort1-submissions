import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from '../schema/users';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
  ) {}

  async findOne(query: Record<string, any>): Promise<Users | null> {
    return this.userModel.findOne(query);
  }

  async find(query: Record<string, any>): Promise<Users[]> {
    return this.userModel.find(query);
  }

  async create(data: Record<string, any>): Promise<Users> {
    return this.userModel.create(data);
  }

  async updateOne(query: Record<string, any>, data: Record<string, any>): Promise<any> {
    return this.userModel.updateOne(query, data);
  }

  async findById(id: string): Promise<Users | null> {
    return this.userModel.findById(id);
  }

  async findOneAndUpdate(query: Record<string, any>, update: Record<string, any>): Promise<Users | null> {
    return this.userModel.findOneAndUpdate(query, update, { new: true });
  }

  async findOneAndDelete(query: Record<string, any>): Promise<Users | null> {
    return this.userModel.findOneAndDelete(query);
  }

  async deleteOne(query: Record<string, any>): Promise<any> {
    return this.userModel.deleteOne(query);
  }

  async countDocuments(query: Record<string, any>): Promise<number> {
    return this.userModel.countDocuments(query);
  }
}
