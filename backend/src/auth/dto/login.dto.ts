import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  @ApiPropertyOptional({ description: 'User email address', example: 'user@example.com' })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Password (required for local login)', example: 'password123' })
  password?: string;

}
