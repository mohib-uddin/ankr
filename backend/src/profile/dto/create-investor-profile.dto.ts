import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateInvestorProfileDto {
  @ApiProperty({ example: 'Jane A. Smith' })
  @IsString()
  @IsNotEmpty()
  fullLegalName: string;

  @ApiProperty({ example: '123 Main Street, New York' })
  @IsString()
  @IsNotEmpty()
  primaryAddress: string;

  @ApiProperty({ example: '(555) 000 - 0000' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '***-**-****' })
  @IsString()
  @IsNotEmpty()
  ssn: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isGuarantor?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  hasLegalActions?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  hasFiledBankruptcy?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isObligatedForSupport?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  hasPledgedAssets?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  hasForeclosures?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isPartyToLawsuit?: boolean;

  @ApiProperty({ example: 'uuid-of-common-profile' })
  @IsString()
  @IsNotEmpty()
  profileId: string;
}
