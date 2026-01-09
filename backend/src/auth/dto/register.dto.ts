// src/auth/dto/register.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsPhoneNumber,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address (stored normalized as lowercase).',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  @MaxLength(254, { message: 'Email is too long' })
  email!: string;

  @ApiProperty({
    example: '********',
    minLength: 8,
    description:
      'Password for the account. Enforce complexity rules here (register/reset), not on login.',
  })
  // NOTE: I am NOT trimming password because spaces may be meaningful characters.
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128, { message: 'Password is too long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
    message:
      'Password must include uppercase, lowercase, number, and special character',
  })
  password!: string;

  @ApiProperty({
    example: 'John',
    description: 'First name (2–50 chars).',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name is too long' })
  firstName!: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name (2–50 chars).',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name is too long' })
  lastName!: string;

  @ApiPropertyOptional({
    example: '+14155552671',
    description: 'Optional phone number in E.164 format (recommended).',
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Phone must be a string' })
  @MaxLength(32, { message: 'Phone is too long' })
  @IsPhoneNumber(undefined, {
    message: 'Phone number must be valid (E.164 recommended)',
  })
  phone?: string;
}
