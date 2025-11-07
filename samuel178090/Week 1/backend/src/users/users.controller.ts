import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Res,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { CurrentUser } from '../shared/decorators/user.decorator';
import type { Response } from 'express';
import { userTypes } from 'src/shared/schema/users';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @Post()
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 403, description: 'Account not verified' })
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(ValidationPipe) loginUser: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const loginRes = await this.usersService.login(
      loginUser.email,
      loginUser.password,
    );
    
    if (loginRes.success && loginRes.result?.token) {
      // Set secure HTTP-only cookie
      response.cookie('_digi_auth_token', loginRes.result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });
      
      // Remove token from response for security
      if (loginRes.result && 'token' in loginRes.result) {
        delete (loginRes.result as any).token;
      }
    }
    
    return loginRes;
  }

  @ApiOperation({ summary: 'Verify user email with OTP' })
  @ApiParam({ name: 'otp', description: 'OTP code sent to email' })
  @ApiParam({ name: 'email', description: 'User email address' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  @Get('/verify-email/:otp/:email')
  async verifyEmail(
    @Param('otp') otp: string, 
    @Param('email') email: string
  ) {
    return await this.usersService.verifyEmail(otp, email);
  }

  @ApiOperation({ summary: 'Send OTP to user email' })
  @ApiParam({ name: 'email', description: 'User email address' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get('send-otp-mail/:email')
  async sendOtpEmail(@Param('email') email: string) {
    return await this.usersService.sendOtpEmail(email);
  }

  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @Put('/logout')
  async logout(@Res() res: Response) {
    res.clearCookie('_digi_auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Logout successful',
      result: null,
    });
  }

  @ApiOperation({ summary: 'Send forgot password email' })
  @ApiParam({ name: 'email', description: 'User email address' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get('forgot-password/:email')
  async forgotPassword(@Param('email') email: string) {
    return await this.usersService.forgotPassword(email);
  }

  @ApiOperation({ summary: 'Create admin user' })
  @ApiResponse({ status: 201, description: 'Admin user created successfully' })
  @Get('create-admin')
  async createAdmin() {
    return await this.usersService.createAdmin();
  }

  @ApiOperation({ summary: 'Create customer user for testing' })
  @ApiResponse({ status: 201, description: 'Customer user created successfully' })
  @Get('create-customer')
  async createCustomer() {
    return await this.usersService.createCustomer();
  }

  @ApiOperation({ summary: 'Setup both admin and customer users' })
  @ApiResponse({ status: 200, description: 'Users setup complete' })
  @Get('setup-users')
  async setupUsers() {
    const adminResult = await this.usersService.createAdmin();
    const customerResult = await this.usersService.createCustomer();
    
    return {
      success: true,
      message: 'All users setup complete',
      result: {
        admin: {
          email: 'admin@example.com',
          password: 'admin123'
        },
        customer: {
          email: 'customer@example.com',
          password: 'customer123'
        },
        note: 'Both users are created and verified. You can login immediately with either account.'
      }
    };
  }

  @ApiOperation({ summary: 'Setup admin and sample data' })
  @ApiResponse({ status: 200, description: 'Admin and sample data created successfully' })
  @Get('setup-admin')
  async setupAdmin() {
    // Create admin user
    await this.usersService.createAdmin();
    
    return {
      success: true,
      message: 'Admin setup complete',
      result: {
        email: 'admin@example.com',
        password: 'admin123',
        note: 'Admin user created. Login at http://localhost:3000/auth with these credentials. Also call GET /api/v1/seed/products to add sample products.'
      }
    };
  }

  @ApiOperation({ summary: 'Get login information for all test users' })
  @ApiResponse({ status: 200, description: 'Login info retrieved successfully' })
  @Get('login-info')
  async getLoginInfo() {
    return {
      success: true,
      message: 'Test user login information',
      result: {
        admin: {
          email: 'admin@example.com',
          password: 'admin123',
          type: 'admin'
        },
        customer: {
          email: 'customer@example.com',
          password: 'customer123',
          type: 'customer'
        },
        note: 'Call GET /api/v1/users/setup-users first to create these accounts if they do not exist.'
      }
    };
  }

  @ApiOperation({ summary: 'Delete user by email (Admin function)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get('delete-user/:email')
  async deleteUserByEmail(@Param('email') email: string) {
    return await this.usersService.deleteUserByEmail(email);
  }

  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by user type' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query('type') type?: string) {
    return await this.usersService.findAll(type || '');
  }

  @ApiOperation({ summary: 'Update user profile' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('/update-name-password/:id')
  async update(
    @Param('id') id: string, 
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.usersService.updatePasswordOrName(id, updateUserDto, currentUser);
  }

  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.usersService.remove(id, currentUser);
  }
}
