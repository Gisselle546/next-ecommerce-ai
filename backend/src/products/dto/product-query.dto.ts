import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

export enum ProductSortBy {
  PRICE = 'price',
  CREATED_AT = 'createdAt',
  AVERAGE_RATING = 'averageRating',
  SALES = 'salesCount',
  NAME = 'name',
}

export class ProductQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  q?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxPrice?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  rating?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  inStock?: boolean;

  @ApiPropertyOptional({ enum: ProductSortBy })
  @IsEnum(ProductSortBy)
  @IsOptional()
  declare sortBy?: ProductSortBy;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  @IsString()
  @IsOptional()
  declare order?: 'ASC' | 'DESC';
}
