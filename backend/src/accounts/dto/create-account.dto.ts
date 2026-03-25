import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
import { AccountTypeEnum } from '@types';

export class CreateAccountDto {
  @ApiProperty({ example: 'Chase' })
  @IsString()
  @IsNotEmpty()
  institution: string;

  @ApiProperty({ enum: AccountTypeEnum, example: AccountTypeEnum.CHECKING_ACCOUNT })
  @IsEnum(AccountTypeEnum)
  @IsNotEmpty()
  accountType: AccountTypeEnum;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  @IsNotEmpty()
  currentBalance: number;

  @ApiProperty({ example: 'uuid-of-common-profile' })
  @IsString()
  @IsNotEmpty()
  profileId: string;
}

export class CreateAccountWithoutProfileDto extends OmitType(
  CreateAccountDto,
  ['profileId'] as const,
) {}
