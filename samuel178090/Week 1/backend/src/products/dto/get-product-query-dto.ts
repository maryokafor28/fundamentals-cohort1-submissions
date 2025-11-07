import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class GetProductQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  platformType?: string;

  @IsOptional()
  @IsString()
  baseType?: string;

  @IsOptional()
  @IsString()
  homepage?: string;

  @IsOptional()
  @IsString()
  dashboard?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsNumberString()
  offset?: string;

  @IsOptional()
  @IsString()
  sort?: string;
}
