import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ValidateCodeDto {
  @IsString()
  @MinLength(5)
  @MaxLength(5)
  @ApiProperty({ description: 'Verification code sent on the email address' })
  code: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email of the user' })
  email: string;
}
