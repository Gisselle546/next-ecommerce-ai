import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminResponseDto {
  @ApiProperty({ example: 'Thank you for your feedback!' })
  @IsString()
  @MinLength(5)
  adminResponse: string;
}
