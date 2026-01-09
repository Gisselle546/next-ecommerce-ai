import { IsOptional, IsInt, Min, Max, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';

enum ReviewSortBy {
  RATING = 'rating',
  HELPFUL = 'helpfulCount',
  DATE = 'createdAt',
}

export class ReviewQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  @Type(() => Number)
  rating?: number;

  @ApiPropertyOptional({ enum: ReviewSortBy, default: ReviewSortBy.DATE })
  @IsEnum(ReviewSortBy)
  @IsOptional()
  sortBy?: ReviewSortBy = ReviewSortBy.DATE;
}
