import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateIncomeDto {
  @ApiProperty({ example: 120000.00 })
  @IsNumber()
  @IsOptional()
  primaryIncome?: number;

  @ApiProperty({ example: 45000.00 })
  @IsNumber()
  @IsOptional()
  rentalIncome?: number;

  @ApiProperty({ example: 5000.00 })
  @IsNumber()
  @IsOptional()
  otherIncome?: number;

  @ApiProperty({ example: 'uuid-of-common-profile' })
  @IsString()
  @IsNotEmpty()
  profileId: string;
}

export class CreateIncomeWithoutProfileDto extends OmitType(
  CreateIncomeDto,
  ['profileId'] as const,
) {}
