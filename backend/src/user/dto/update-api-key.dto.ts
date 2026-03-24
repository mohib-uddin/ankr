import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateApiKeyDto {
  @IsString()
  @ApiProperty({ description: 'API key' })
  key: string;
}