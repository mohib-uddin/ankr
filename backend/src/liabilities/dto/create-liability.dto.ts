import { ApiProperty } from '@nestjs/swagger';
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

  @ApiProperty({ example: 'None' })
  @IsString()
  @IsOptional()
  linkedAsset?: string;

  @ApiProperty({ example: 'path/to/statement.pdf' })
  @IsString()
  @IsOptional()
  statementUrl?: string;

  @ApiProperty({ example: 'uuid-of-common-profile' })
  @IsString()
  @IsNotEmpty()
  profileId: string;
}
