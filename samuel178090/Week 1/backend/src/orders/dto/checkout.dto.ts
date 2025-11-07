import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CheckoutItemDto {
  @ApiProperty({ description: 'Product ID' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'SKU ID' })
  @IsString()
  @IsNotEmpty()
  skuId: string;

  @ApiProperty({ description: 'SKU Price ID for Stripe' })
  @IsString()
  @IsNotEmpty()
  skuPriceId: string;

  @ApiProperty({ description: 'Quantity', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Price per item' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty({ description: 'Product image URL', required: false })
  @IsOptional()
  @IsString()
  productImage?: string;

  @ApiProperty({ description: 'Is lifetime license' })
  @IsBoolean()
  lifetime: boolean;

  @ApiProperty({ description: 'Validity in days', required: false })
  @IsOptional()
  @IsNumber()
  validity?: number;
}

export class CheckoutSessionDto {
  @ApiProperty({ 
    description: 'Array of checkout items', 
    type: [CheckoutItemDto],
    minItems: 1 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'At least one item is required for checkout' })
  @Type(() => CheckoutItemDto)
  checkoutDetails: CheckoutItemDto[];
}
