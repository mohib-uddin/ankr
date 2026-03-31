import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class PackageTemplateItemDto {
  @ApiProperty({ example: "id-of-item", required: false })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({ example: "Driver's License" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "Valid state driver's license" })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: "Identity" })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  minCount: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  maxCount: number;
}
