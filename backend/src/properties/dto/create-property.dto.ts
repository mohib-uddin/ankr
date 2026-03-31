import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PropertyTypeEnum, PropertyStatusEnum } from '@types';

export class CreatePropertyDto {
  @ApiProperty({ example: 'Westlake Commons' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ example: '123 Oak Ave, Austin, TX' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Austin' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'TX' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ example: '78701' })
  @IsString()
  @IsOptional()
  zipCode?: string;

  @ApiProperty({ enum: PropertyTypeEnum, example: PropertyTypeEnum.SINGLE_FAMILY })
  @IsEnum(PropertyTypeEnum)
  @IsNotEmpty()
  propertyType: PropertyTypeEnum;

  @ApiProperty({ enum: PropertyStatusEnum, example: PropertyStatusEnum.ACQUISITION })
  @IsEnum(PropertyStatusEnum)
  @IsOptional()
  currentStatus?: PropertyStatusEnum;

  @ApiProperty({ example: 20000 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  grossSqFt?: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  unitsDoors?: number;

  @ApiProperty({ example: 2005 })
  @Type(() => Number)
  @IsNumber()
  @Min(1000)
  @Max(new Date().getFullYear())
  @IsOptional()
  yearBuilt?: number;

  @ApiProperty({ example: 0.5 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  lotSizeAcres?: number;

  @ApiProperty({ example: 'R1, MF-4, C-2' })
  @IsString()
  @IsOptional()
  zoning?: string;

  @ApiProperty({ example: 450000.00 })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  estimatedValue: number;

  @ApiProperty({ example: 320000.00 })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  loanBalance: number;

  @ApiProperty({ example: 2500.00 })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  monthlyRent: number;

  @ApiProperty({ example: 6.5 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  interestRate?: number;

  @ApiProperty({ example: 1200.00 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  monthlyPayment?: number;

  @ApiProperty({ example: 'First National Bank' })
  @IsString()
  @IsOptional()
  lender?: string;

  @ApiProperty({ example: '2025-12-01' })
  @IsDateString()
  @IsOptional()
  maturityDate?: string;

  @ApiProperty({ example: 100 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  ownershipPercentage?: number;

  @ApiProperty({ example: 'uuid-of-common-profile' })
  @IsString()
  @IsNotEmpty()
  profileId: string;
}

export class CreatePropertyWithoutProfileDto extends OmitType(
  CreatePropertyDto,
  ['profileId'] as const,
) {}
