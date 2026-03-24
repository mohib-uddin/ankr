import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOtherAssetDto {
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

  @ApiProperty({ example: 'path/to/brokerage.pdf' })
  @IsString()
  @IsOptional()
  brokerageStatementUrl?: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
