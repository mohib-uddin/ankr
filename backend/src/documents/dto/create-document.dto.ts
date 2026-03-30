import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID, IsEnum, IsArray } from 'class-validator';
import { DocumentCategoryEnum } from '@types';

export class CreateDocumentDto {
  @ApiProperty({ example: '2025_Tax_Return' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: DocumentCategoryEnum, example: DocumentCategoryEnum.TAX })
  @IsEnum(DocumentCategoryEnum)
  @IsNotEmpty()
  category: DocumentCategoryEnum;

  @ApiProperty({ example: 'uuid-of-property', required: false })
  @IsUUID()
  @IsOptional()
  linkedPropertyId?: string;

  @ApiProperty({ example: ['Urgent', 'Tax', '2026'], required: false, type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ example: 'Additional notes about this document...', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: 'uuid-of-folder', required: false })
  @IsUUID()
  @IsOptional()
  folderId?: string;

  @ApiProperty({ example: '/uploads/documents/tax_return.pdf', required: false })
  @IsString()
  @IsOptional()
  filePath?: string;


  @ApiProperty({ example: 'uuid-of-profile' })
  @IsUUID()
  @IsNotEmpty()
  profileId: string;
}

export class CreateDocumentWithoutProfileDto extends OmitType(
  CreateDocumentDto,
  ['profileId'] as const,
) {}
