import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumberString, Length } from 'class-validator';


export class EmailVerificationDto {

    @IsNumberString()
    @Length(5, 5)
    @IsNotEmpty()
    @ApiProperty({ description: "Verification code sent on the email address" })
    code: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ description: 'Email of the user' })
    email: string;
}
