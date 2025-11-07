import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { userTypes } from 'src/shared/schema/users';

export class CreateUserDto {
  @ApiProperty({ description: 'User full name', example: 'John Doe' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;

  @ApiProperty({ description: 'User email address', example: 'john@example.com' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiPropertyOptional({ 
    description: 'User type', 
    enum: userTypes, 
    default: userTypes.CUSTOMER 
  })
  @IsOptional()
  @IsString()
  @IsIn([userTypes.ADMIN, userTypes.CUSTOMER], { 
    message: 'Type must be either admin or customer' 
  })
  type?: string = userTypes.CUSTOMER;

  @ApiPropertyOptional({ description: 'Admin secret token for admin registration' })
  @IsString()
  @IsOptional()
  secretToken?: string;

  @ApiPropertyOptional({ description: 'Email verification status' })
  @IsOptional()
  isVerified?: boolean = false;
}

export class LoginUserDto {
  @ApiProperty({ description: 'User email address', example: 'john@example.com' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
