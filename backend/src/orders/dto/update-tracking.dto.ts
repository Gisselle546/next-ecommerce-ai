import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTrackingDto {
  @ApiProperty({ example: '1Z999AA10123456784' })
  @IsString()
  @MinLength(5)
  trackingNumber: string;

  @ApiProperty({ example: 'FedEx' })
  @IsString()
  @MinLength(2)
  carrier: string;
}
