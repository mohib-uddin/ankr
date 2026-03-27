import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateBusinessesEntityDto {
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

  @ApiProperty({ example: 'uuid-of-common-profile' })
  @IsString()
  @IsNotEmpty()
  profileId: string;
}

export class CreateBusinessesEntityWithoutProfileDto extends OmitType(
  CreateBusinessesEntityDto,
  ['profileId'] as const,
) {}
