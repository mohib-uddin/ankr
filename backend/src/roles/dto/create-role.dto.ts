import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'INVESTOR', description: 'Unique key for role (auto-generated if not provided)' })
  @IsString()
  @IsOptional()
  key?: string;

  @ApiProperty({ example: 'Investor', description: 'Display name of the role' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Individual Investor Profile', description: 'Description of the role' })
  @IsString()
  @IsOptional()
  description?: string;
}
