import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ValidatePackageDto {
  @ApiProperty({ example: 'uuid-link' })
  @IsString()
  @IsNotEmpty()
  sharedLink: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  securityCode: string;
}
