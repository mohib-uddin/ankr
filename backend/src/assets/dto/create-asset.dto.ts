import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAssetDto {
  @ApiProperty({ example: 450000.00 })
  @IsNumber()
  @IsOptional()
  publicInvestmentsTotal?: number;

  @ApiProperty({ example: 120000.00 })
  @IsNumber()
  @IsOptional()
  privateInvestments?: number;

  @ApiProperty({ example: 50000.00 })
  @IsNumber()
  @IsOptional()
  otherAssets?: number;

  @ApiProperty({ example: 'uuid-of-common-profile' })
  @IsString()
  @IsNotEmpty()
  profileId: string;
}

export class CreateAssetWithoutProfileDto extends OmitType(
  CreateAssetDto,
  ['profileId'] as const,
) {}
