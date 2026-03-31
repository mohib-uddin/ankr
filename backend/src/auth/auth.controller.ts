import { Controller, Post, Body, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto, EmailVerificationDto, ForgotPasswordDto, ForgotPassChangeDto, ValidateCodeDto, ResendCodeDto, UpdatePasswordDto, LoginResponseDto, ValidatePackageDto } from './dto';
import { UserPackage } from '@entities';
import { ApiTags } from '@nestjs/swagger';
import { Public, SwaggerApiResponse } from '@decorators';
import { ApiMessageData } from '@types';
import { Request } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Login', type: LoginResponseDto })
  async login(@Body() reqBody: LoginDto): Promise<ApiMessageData<LoginResponseDto>> {
    return await this.authService.login(reqBody) as ApiMessageData<LoginResponseDto>;
  }

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @SwaggerApiResponse({ description: 'Signup', statusCode: HttpStatus.CREATED, type: LoginResponseDto })
  async signUp(@Body() reqBody: SignupDto) {
    return await this.authService.signUp(reqBody);
  }

  @Public()
  @Post('email-verification')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse('Email Verification')
  async verifyEmail(@Body() reqBody: EmailVerificationDto) {
    return await this.authService.verifyEmail(reqBody);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse('Forgot Password')
  async forgotPassword(@Body() reqBody: ForgotPasswordDto) {
    return await this.authService.forgotPassword(reqBody);
  }

  @Public()
  @Post('forgot-password/change-password')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse('Reset Password')
  async forgotPasswordChange(@Body() reqBody: ForgotPassChangeDto) {
    return await this.authService.changePassword(reqBody);
  }

  @Public()
  @Post('forgot-password/validate-code')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse('Validate Reset Password Code')
  async validateCode(@Body() reqBody: ValidateCodeDto) {
    return await this.authService.validateCode(reqBody);
  }

  @Public()
  @Post('verification-code')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse('Validate Reset Password Code')
  async resendCode(@Body() reqBody: ResendCodeDto) {
    return await this.authService.resendCode(reqBody);
  }

  @Post('password/update')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse('Update Password')
  async updatePassword(@Req() req: Request, @Body() reqBody: UpdatePasswordDto) {
    return await this.authService.updatePassword(req.user.id, reqBody);
  }

  @Public()
  @Post('validate-package')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Validate a package link and security code', type: UserPackage })
  async validatePackage(@Body() reqBody: ValidatePackageDto) {
    return await this.authService.validatePackage(reqBody);
  }

}
