import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreatePropertyDto {
  @ApiProperty({ example: '123 Oak Ave, Austin, TX' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Single Family' })
  @IsString()
  @IsNotEmpty()
  propertyType: string;

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

  @ApiProperty({ example: 'path/to/mortgage.pdf' })
  @IsString()
  @IsOptional()
  mortgageStatementUrl?: string;

  @ApiProperty({ example: 'uuid-of-common-profile' })
  @IsString()
  @IsNotEmpty()
  profileId: string;
}
