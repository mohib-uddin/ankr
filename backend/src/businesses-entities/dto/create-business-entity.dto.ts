import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateBusinessEntityDto {
  @ApiProperty({ example: 'Smith Holding LLC' })
  @IsString()
  @IsNotEmpty()
  entityName: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @IsNotEmpty()
  ownershipPercentage: number;

  @ApiProperty({ example: 450000.00 })
  @IsNumber()
  @IsNotEmpty()
  estimatedValue: number;

  @ApiProperty({ example: 'path/to/agreement.pdf' })
  @IsString()
  @IsOptional()
  operatingAgreementUrl?: string;

  @ApiProperty({ example: 'uuid-of-common-profile' })
  @IsString()
  @IsNotEmpty()
  profileId: string;
}
