import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  IsUUID,
  Min,
  MinLength,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Premium Laptop' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiPropertyOptional({ example: 'premium-laptop' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ example: 'High-performance laptop for professionals' })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({ example: 1299.99 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({ example: 1499.99 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  compareAtPrice?: number;

  @ApiProperty({ example: 'LAPTOP-001' })
  @IsString()
  sku: string;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock: number;

  @ApiPropertyOptional({ example: 1.5 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  weight?: number;

  @ApiPropertyOptional({ example: '35x25x2 cm' })
  @IsString()
  @IsOptional()
  dimensions?: string;

  @ApiPropertyOptional({ example: ['image1.jpg', 'image2.jpg'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ example: ['electronics', 'computers', 'featured'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ example: true, default: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: 'uuid-of-category' })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({ example: 'uuid-of-vendor' })
  @IsUUID()
  @IsOptional()
  vendorId?: string;

  @ApiPropertyOptional({ example: 'Premium Laptop - Best Price' })
  @IsString()
  @IsOptional()
  metaTitle?: string;

  @ApiPropertyOptional({ example: 'Shop premium laptops...' })
  @IsString()
  @IsOptional()
  metaDescription?: string;

  @ApiPropertyOptional({
    example: { processor: 'Intel i7', ram: '16GB', storage: '512GB SSD' },
  })
  @IsObject()
  @IsOptional()
  specifications?: Record<string, any>;
}
