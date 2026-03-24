import { RegexConstants } from '@constants';
import { ErrorResponseMessages } from '@messages';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class ForgotPassChangeDto {

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email of the user' })
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @ApiProperty({ description: 'New password of the user' })
  @Matches(RegexConstants.PASSWORD, { message: ErrorResponseMessages.passwordFormat })
  newPassword: string;

  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @ApiProperty({ description: 'Again password for confirmation' })
  @Matches(RegexConstants.PASSWORD, { message: ErrorResponseMessages.passwordFormat })
  confirmPassword: string;
}
