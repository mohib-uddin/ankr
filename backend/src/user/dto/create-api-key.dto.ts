import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApiProviderEnum } from '@types';

export class CreateApiKeyDto {
  @IsString()
  @IsEnum(ApiProviderEnum)
  @ApiProperty({ description: 'Provider enum' })
  provider: ApiProviderEnum;

  @IsString()
  @ApiProperty({ description: 'API key' })
  key: string;
}