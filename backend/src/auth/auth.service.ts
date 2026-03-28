import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SignupDto, ResendCodeDto, EmailVerificationDto, LoginDto, ForgotPasswordDto, ValidateCodeDto, ForgotPassChangeDto, UpdatePasswordDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from '@entities';
import { AppHelper } from '@helpers/app.helper';
import { AuthErrorMessages, SuccessResponseMessages, UserErrorMessages } from '@messages';
import { ApiMessageData, ApiMessage } from '@types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    private appHelper: AppHelper,
  ) {}

  async signUp(signUpObj: SignupDto): Promise<ApiMessageData> {
    const { firstName, lastName, email, password } = signUpObj;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) throw new BadRequestException(AuthErrorMessages.emailExists);

    const role = await this.roleRepository.findOne({ where: { key: 'investor-role' } });
    if (!role) throw new BadRequestException(AuthErrorMessages.roleNotExists);

    const verificationCode: string = await this.appHelper.generateCode();

    const createdUser = await this.userRepository.save({
      firstName,
      lastName,
      email,
      password: await this.appHelper.hashData(password),
      verificationCode,
      isVerified: false,
      role
    });

    const mailSubject: string = 'Email Verification - Ankr';
    const replacements = 'Your verification token is: ' + verificationCode;

    await this.appHelper.sendMail(createdUser.email, mailSubject, replacements);

    const { access_token } = await this.appHelper.getTokens(createdUser.id.toString());

    // Sanitize user object for response
    const { password: _, verificationCode: __, isPassCodeValid: ___, ...safeUser } = createdUser;

    return { message: SuccessResponseMessages.successGeneral, data: { user: safeUser, access_token } };
  }

  async resendCode(resendCodeBody: ResendCodeDto): Promise<ApiMessage> {
    const { email } = resendCodeBody;

    const userExists = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'verificationCode'],
    });
    if (!userExists) throw new NotFoundException(UserErrorMessages.userNotExists);
    if (userExists.isVerified) throw new BadRequestException(AuthErrorMessages.emailVerified);

    const verificationCode: string = await this.appHelper.generateCode();

    await this.userRepository.update(userExists.id, {
      verificationCode,
    });

    const mailSubject: string = 'Resend Verification Code - Ankr';
    const replacements = 'Your verification token is: ' + verificationCode;

    await this.appHelper.sendMail(userExists.email, mailSubject, replacements);

    return {
      message: SuccessResponseMessages.successGeneral,
    };
  }

  async verifyEmail(emailVerificationBody: EmailVerificationDto) {
    const { code, email } = emailVerificationBody;
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'verificationCode', 'isVerified'],
    });
    if (!user) throw new NotFoundException(UserErrorMessages.userNotExists);
    if (user.isVerified) throw new BadRequestException(AuthErrorMessages.emailVerified);
    if (code !== user.verificationCode) throw new BadRequestException(AuthErrorMessages.invalidCode);
    user.verificationCode = '';
    user.isVerified = true;
    await this.userRepository.save(user);
    return { message: SuccessResponseMessages.emailVerification };
  }

  async login(loginDto: LoginDto): Promise<ApiMessageData> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'firstName', 'lastName', 'email', 'password', 'isVerified', 'isActive', 'picture'], // Added picture
      relations: [
        'role', // Added role
        'profile',
        'profile.investorProfile',
        'profile.accounts',
        'profile.properties',
        'profile.businessEntities',
        'profile.asset',
        'profile.liability',
        'profile.income'
      ]
    });

    if (!user) throw new BadRequestException(AuthErrorMessages.invalidEmail);

    const passwordMatches = await this.appHelper.compareData(password, user.password);
    if (!passwordMatches) throw new BadRequestException(AuthErrorMessages.invalidPassword);

    const { access_token } = await this.appHelper.getTokens(user.id.toString());

    // Sanitize user object for response
    user.password = undefined;
    
    return {
      message: SuccessResponseMessages.successGeneral,
      data: { user, access_token },
    };
  }

  async forgotPassword(forgotPasswordBody: ForgotPasswordDto) {
    const { email } = forgotPasswordBody;

    const user = await this.userRepository.findOne({
      where: { email, isActive: true },
    });
    if (!user) throw new BadRequestException(AuthErrorMessages.invalidEmail);
    if (!user.isVerified) throw new BadRequestException(AuthErrorMessages.accountNotVerified);
    const passwordChangeCode: string = await this.appHelper.generateCode();
    user.verificationCode = passwordChangeCode;

    const mailSubject: string = 'Forgot Password - Ankr';
    const replacements = {
      userName: user.firstName,
      text: `You requested a forgot password request.<br/>Use the token ${passwordChangeCode} below to complete the password reset process.`,
      verificationCode: passwordChangeCode,
    };

    await this.appHelper.sendMail(user.email, mailSubject, replacements.text);

    await this.userRepository.save(user);
    return { message: SuccessResponseMessages.mailSent };
  }

  async validateCode(validateCodeBody: ValidateCodeDto) {
    const { email, code } = validateCodeBody;

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'verificationCode'],
    });
    if (!user) throw new BadRequestException(AuthErrorMessages.invalidEmail);
    if (code !== user.verificationCode) {
      throw new UnauthorizedException(AuthErrorMessages.invalidPassCode);
    }
    user.verificationCode = '';
    user.isPassCodeValid = true;
    await this.userRepository.save(user);
    return { message: SuccessResponseMessages.codeIsValid };
  }

  async changePassword(changePasswordBody: ForgotPassChangeDto) {
    const { email, newPassword, confirmPassword } = changePasswordBody;

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'isPassCodeValid'],
    });
    if (!user) throw new BadRequestException(AuthErrorMessages.invalidEmail);
    if (!user.isPassCodeValid) throw new BadRequestException(AuthErrorMessages.passCodeNotVerified);
    if (newPassword !== confirmPassword) {
      throw new UnauthorizedException(AuthErrorMessages.passwordNotMatch);
    }
    user.password = await this.appHelper.hashData(newPassword);
    user.isPassCodeValid = false;
    await this.userRepository.save(user);

    return { message: SuccessResponseMessages.passChanged };
  }

  async updatePassword(id: string, updatePasswordBody: UpdatePasswordDto) {
    const { currentPassword, newPassword, confirmPassword } = updatePasswordBody;

    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'password', 'email', 'firstName'],
    });
    if (!user) throw new BadRequestException(AuthErrorMessages.invalidEmail);

    if (!(await this.appHelper.compareData(currentPassword, user.password))) {
      throw new UnauthorizedException(AuthErrorMessages.currentPassword);
    }
    if (newPassword !== confirmPassword) {
      throw new UnauthorizedException(AuthErrorMessages.passwordNotMatch);
    }

    user.password = await this.appHelper.hashData(newPassword);
    await this.userRepository.save(user);

    const mailSubject: string = 'Password Update - Ankr';
    const replacements = {
      userName: user.firstName,
      text: 'You password has been updated successfully',
    };

    await this.appHelper.sendMail(user.email, mailSubject, replacements.text);

    return { message: SuccessResponseMessages.passChanged };
  }
}
