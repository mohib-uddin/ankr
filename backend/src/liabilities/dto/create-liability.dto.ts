import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLiabilityDto {
  @ApiProperty({ example: 12000.00 })
  @IsNumber()
  @IsOptional()
  creditCardsTotal?: number;

  @ApiProperty({ example: 15000.00 })
  @IsNumber()
  @IsOptional()
  personalLoans?: number;

  @ApiProperty({ example: 5000.00 })
  @IsNumber()
  @IsOptional()
  otherDebt?: number;

  @ApiProperty({ example: 'Chase Auto Loan', description: 'Link other debt to specific assets if applicable' })
  @IsString()
  @IsOptional()
  linkedAsset?: string;

  @ApiProperty({ example: 'uuid-of-common-profile' })
  @IsString()
  @IsNotEmpty()
  profileId: string;
}

export class CreateLiabilityWithoutProfileDto extends OmitType(
  CreateLiabilityDto,
  ['profileId'] as const,
) {}
