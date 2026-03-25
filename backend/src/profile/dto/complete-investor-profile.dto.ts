import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested, IsOptional, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import {
  CreateAccountWithoutProfileDto,
  CreatePropertyWithoutProfileDto,
  CreateBusinessesEntityWithoutProfileDto,
  CreateAssetWithoutProfileDto,
  CreateLiabilityWithoutProfileDto,
  CreateIncomeWithoutProfileDto,
} from '@dtos';
import { CreateInvestorProfileWithoutProfileDto } from './create-investor-profile.dto';

export class CompleteInvestorProfileDto extends CreateInvestorProfileWithoutProfileDto {
  @ApiProperty({ example: 'uuid-of-user' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ type: [CreateAccountWithoutProfileDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAccountWithoutProfileDto)
  accounts?: CreateAccountWithoutProfileDto[];

  @ApiProperty({ type: [CreatePropertyWithoutProfileDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePropertyWithoutProfileDto)
  properties?: CreatePropertyWithoutProfileDto[];

  @ApiProperty({ type: [CreateBusinessesEntityWithoutProfileDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBusinessesEntityWithoutProfileDto)
  businessEntities?: CreateBusinessesEntityWithoutProfileDto[];

  @ApiProperty({ type: CreateAssetWithoutProfileDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAssetWithoutProfileDto)
  asset?: CreateAssetWithoutProfileDto;

  @ApiProperty({ type: CreateLiabilityWithoutProfileDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateLiabilityWithoutProfileDto)
  liability?: CreateLiabilityWithoutProfileDto;

  @ApiProperty({ type: CreateIncomeWithoutProfileDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateIncomeWithoutProfileDto)
  income?: CreateIncomeWithoutProfileDto;
}
