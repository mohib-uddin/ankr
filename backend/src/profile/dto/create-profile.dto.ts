import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ProfileTypeEnum } from '@types';

export class CreateProfileDto {
  @ApiProperty({ enum: ProfileTypeEnum, example: ProfileTypeEnum.INVESTOR })
  @IsEnum(ProfileTypeEnum)
  @IsNotEmpty()
  type: ProfileTypeEnum;

  @ApiProperty({ example: 'uuid-of-user' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
