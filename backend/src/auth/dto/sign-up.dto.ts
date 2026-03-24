import { IsEmail, IsNumber, IsOptional, IsPositive, IsString, Length, Matches, Min } from 'class-validator';
import { RegexConstants } from '@constants';
import { ErrorResponseMessages, ErrorValidationMessage } from '@messages';
import { Trim } from '@decorators';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SignupDto {
  @IsString()
  @Trim()
  @ApiProperty({ description: 'First name of the user' })
  firstName: string;

  @IsString()
  @Trim()
  @ApiProperty({ description: 'Last name of the user' })
  lastName: string;

  @IsString()
  @Trim()
  @IsEmail()
  @ApiProperty({ description: 'Email of the user' })
  email: string;

  @IsString()
  @Trim()
  @Matches(RegexConstants.PASSWORD, { message: ErrorResponseMessages.passwordFormat })
  @ApiProperty({ description: 'Minimum 8 characters password of the user' })
  password: string;
}
