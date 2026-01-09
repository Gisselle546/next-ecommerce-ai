import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApplyCouponDto {
  @ApiProperty({ example: 'SUMMER2025' })
  @IsString()
  @MinLength(3)
  code: string;
}
