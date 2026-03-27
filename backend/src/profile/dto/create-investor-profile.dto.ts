import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsMobilePhone } from 'class-validator';

export class CreateInvestorProfileDto {
  @ApiProperty({ example: 'Mohammad Mohib Uddin' })
  @IsString()
  @IsNotEmpty()
  fullLegalName: string;

  @ApiProperty({ example: '123 Oak Ave, Austin, TX' })
  @IsString()
  @IsNotEmpty()
  primaryAddress: string;

  @ApiProperty({ example: '+15550109999' })
  @IsMobilePhone()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '***-**-1234' })
  @IsString()
  @IsNotEmpty()
  ssn: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  isGuarantor?: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  hasLegalActions?: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  hasFiledBankruptcy?: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  isObligatedForSupport?: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  hasPledgedAssets?: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  hasForeclosures?: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  isPartyToLawsuit?: boolean;

  @ApiProperty({ example: 'uuid-of-profile' })
  @IsString()
  @IsNotEmpty()
  profileId: string;
}

export class CreateInvestorProfileWithoutProfileDto extends OmitType(
  CreateInvestorProfileDto,
  ['profileId'] as const,
) {}
