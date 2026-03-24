import { RegexConstants } from '@constants';
import { ErrorResponseMessages } from '@messages';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordDto {

  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @ApiProperty({ description: 'Current password of the user' })
  currentPassword: string;

  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(RegexConstants.PASSWORD, { message: ErrorResponseMessages.passwordFormat })
  @ApiProperty({ description: 'New password of the user' })
  newPassword: string;

  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(RegexConstants.PASSWORD, { message: ErrorResponseMessages.passwordFormat })
  @ApiProperty({ description: 'Again password for confirmation' })
  confirmPassword: string;
}
