import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({ example: 'Chase' })
  @IsString()
  @IsNotEmpty()
  institution: string;

  @ApiProperty({ example: 'Saving Account' })
  @IsString()
  @IsNotEmpty()
  accountType: string;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  @IsNotEmpty()
  currentBalance: number;

  @ApiProperty({ example: 'path/to/statement.pdf' })
  @IsString()
  @IsOptional()
  statementUrl?: string;

  @ApiProperty({ example: 'uuid-of-common-profile' })
  @IsString()
  @IsNotEmpty()
  profileId: string;
}
