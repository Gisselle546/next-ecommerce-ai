import { PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';
import { IsUUID } from 'class-validator';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @IsUUID()
  productId?: string;
}
