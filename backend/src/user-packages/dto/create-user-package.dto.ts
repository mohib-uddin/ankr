import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PackageDocumentDto } from './package-document.dto';

export class CreateUserPackageDto {
  @ApiProperty({ example: 'My Mortgage Docs' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'uuid-of-template' })
  @IsUUID()
  @IsNotEmpty()
  templateId: string;

  @ApiProperty({ type: [PackageDocumentDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageDocumentDto)
  documents?: PackageDocumentDto[];

  @ApiProperty({ example: '123456', required: false })
  @IsString()
  @IsOptional()
  securityCode?: string;

  @ApiProperty({ example: 30, description: 'Expiration in days (max 90)', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(90)
  expiresInDays?: number;

  @ApiProperty({ example: false, description: 'Force regeneration of share link', required: false })
  @IsOptional()
  @IsBoolean()
  regenerateLink?: boolean;

  @ApiProperty({ example: false, description: 'Force regeneration of security code', required: false })
  @IsOptional()
  @IsBoolean()
  regenerateSecurityCode?: boolean;
}
