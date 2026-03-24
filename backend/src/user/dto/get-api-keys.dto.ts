import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApiProviderEnum } from '@types';

export class GetApiKeyDto {
  @IsOptional()
  @IsString()
  @IsEnum(ApiProviderEnum)
  @ApiPropertyOptional({ description: 'Provided enum' })
  provider?: string;
}
