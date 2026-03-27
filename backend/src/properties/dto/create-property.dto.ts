import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { PropertyTypeEnum } from '@types';

export class CreatePropertyDto {
  @ApiProperty({ example: '123 Oak Ave, Austin, TX' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ enum: PropertyTypeEnum, example: PropertyTypeEnum.SINGLE_FAMILY })
  @IsEnum(PropertyTypeEnum)
  @IsNotEmpty()
  propertyType: PropertyTypeEnum;

  @ApiProperty({ example: 450000.00 })
  @IsNumber()
  @IsNotEmpty()
  estimatedValue: number;

  @ApiProperty({ example: 320000.00 })
  @IsNumber()
  @IsNotEmpty()
  loanBalance: number;

  @ApiProperty({ example: 2500.00 })
  @IsNumber()
  @IsNotEmpty()
  monthlyRent: number;

  @ApiProperty({ example: 6.5 })
  @IsNumber()
  @IsOptional()
  interestRate?: number;

  @ApiProperty({ example: 1200.00 })
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
