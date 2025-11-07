import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

@Controller('user-debug')
export class UserDebugController {
  constructor(private readonly userDB: UserRepository) {}

  @Get('check-user')
  async checkUser(@Body() body: { email: string }) {
    try {
      const user = await this.userDB.findOne({ email: body.email });
      if (!user) {
        return { exists: false, message: 'User not found' };
      }
      
      return {
        exists: true,
        user: {
          email: user.email,
          name: user.name,
          isVerified: user.isVerified,
          type: user.type,
          otp: user.otp
        }
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('check-user')
  async checkUserPost(@Body() body: { email: string }) {
    try {
      const user = await this.userDB.findOne({ email: body.email });
      if (!user) {
        return { exists: false, message: 'User not found' };
      }
      
      return {
        exists: true,
        user: {
          email: user.email,
          name: user.name,
          isVerified: user.isVerified,
          type: user.type,
          otp: user.otp
        }
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Delete('delete-user')
  async deleteUser(@Body() body: { email: string }) {
    try {
      const user = await this.userDB.findOne({ email: body.email });
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      
      await this.userDB.findOneAndDelete({ email: body.email });
      
      return {
        success: true,
        message: `User ${body.email} deleted successfully`
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('verify-user')
  async verifyUser(@Body() body: { email: string }) {
    try {
      const user = await this.userDB.findOne({ email: body.email });
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      
      await this.userDB.updateOne({ email: body.email }, { isVerified: true });
      
      return {
        success: true,
        message: `User ${body.email} verified successfully`
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('all-users')
  async getAllUsers() {
    try {
      const users = await this.userDB.find({});
      
      return {
        success: true,
        count: users.length,
        users: users.map(user => ({
          email: user.email,
          name: user.name,
          isVerified: user.isVerified,
          type: user.type
        }))
      };
    } catch (error) {
      return { error: error.message };
    }
  }
}