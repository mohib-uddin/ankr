import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested, IsOptional, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { 
  CreateInvestorProfileDto, 
  CreateAccountDto, 
  CreatePropertyDto, 
  CreateBusinessEntityDto, 
  CreateAssetDto, 
  CreateLiabilityDto, 
  CreateIncomeDto 
} from '@dtos';

export class CompleteInvestorProfileDto {
  @ApiProperty({ example: 'uuid-of-user' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ type: CreateInvestorProfileDto })
  @ValidateNested()
  @Type(() => CreateInvestorProfileDto)
  investorProfile: CreateInvestorProfileDto;

  @ApiProperty({ type: [CreateAccountDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAccountDto)
  accounts?: CreateAccountDto[];

  @ApiProperty({ type: [CreatePropertyDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePropertyDto)
  properties?: CreatePropertyDto[];

  @ApiProperty({ type: [CreateBusinessEntityDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBusinessEntityDto)
  businessEntities?: CreateBusinessEntityDto[];

  @ApiProperty({ type: CreateAssetDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAssetDto)
  asset?: CreateAssetDto;

  @ApiProperty({ type: CreateLiabilityDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateLiabilityDto)
  liability?: CreateLiabilityDto;

  @ApiProperty({ type: CreateIncomeDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateIncomeDto)
  income?: CreateIncomeDto;
}
