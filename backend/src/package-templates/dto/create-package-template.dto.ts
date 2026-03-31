import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PackageTemplateItemDto } from './package-template-item.dto';

export class CreatePackageTemplateDto {
  @ApiProperty({ example: 'Mortgage Application' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Template for standard mortgage application documents' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: [PackageTemplateItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageTemplateItemDto)
  items: PackageTemplateItemDto[];
}
