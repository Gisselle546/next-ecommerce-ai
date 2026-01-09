import { IsUUID, IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 'uuid-of-shipping-address' })
  @IsUUID()
  shippingAddressId: string;

  @ApiPropertyOptional({ example: 'stripe' })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiPropertyOptional({ example: 'SUMMER2025' })
  @IsString()
  @IsOptional()
  couponCode?: string;

  @ApiPropertyOptional({ example: 'Please deliver after 5 PM' })
  @IsString()
  @IsOptional()
  @MinLength(5)
  notes?: string;
}
