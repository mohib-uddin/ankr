import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Repository } from 'typeorm';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { User } from '@entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AppHelper {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private readonly host = this.configService.get<string>('email.host');
  private readonly port = this.configService.get<number>('email.port');
  private readonly user = this.configService.get<string>('email.user');
  private readonly pass = this.configService.get<string>('email.password');

  // Hash data
  public hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  // Compare data
  public async compareData(data: string, compareWith: string): Promise<boolean> {
    return await bcrypt.compare(data, compareWith);
  }

  // Code Generator
  public generateAlphaNumeric(length: number): string {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  public toSentenceCase(str: string): string {
    return str
      .replace(/[-_]/g, ' ')
      .toLowerCase()
      .replace(/^\w/, (char) => char.toUpperCase());
  }

  public generateNumeric() {
    const otp = Math.floor(10000 + Math.random() * 90000);
    return otp.toString();
  }

  // JWT Token Generator
  async getTokens(userId: string, role: string = undefined) {
    const atSecret = this.configService.get<string>('jwt.accessTokenKey');
    const atExpiry = this.configService.get<string>('jwt.accessExpiry');
    const at = await this.jwtService.signAsync({ id: userId, role }, { secret: atSecret, expiresIn: atExpiry });
    return {
      access_token: at,
    };
  }

  async jwtVerify(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: this.configService.get('jwt.accessTokenKey'),
    });
    return payload;
  }
  // JWT Decoder
  async jwtDecoder(headers: any) {
    const token = headers.authorization.split(' ');
    const decodedJwtAccessToken = this.jwtService.decode(token[1]);
    return decodedJwtAccessToken.sub;
  }

  async removeProperties(obj: object, propertiesToRemove: string[]) {
    const newObj = { ...obj };
    for (const prop of propertiesToRemove) {
      delete newObj[prop];
    }
    return newObj;
  }

  //Generate verification Code
  async generateCode() {
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    return code;
  }

  async sendMailWithtemplate(
    email: string,
    mailSubject: string,
    mailMsgOrTemplate: string,
    replacementsOrText?: { [key: string]: string } | string,
    attachments?,
  ): Promise<boolean> {
    let mailOptions: any;
    const transporter = nodemailer.createTransport({
      host: this.host,
      port: Number(this.port),
      secure: false,
      auth: {
        user: this.user,
        pass: this.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const defaultReplacements = {
      companyName: 'Veilion AI',
      supportEmail: 'info@veritag.cloud',
      appUrl: 'https://veritag.com/app',
      currentYear: new Date().getFullYear().toString(),
    };

    if (typeof replacementsOrText === 'object') {
      const templatePath = path.join(process.cwd(), 'public/email', mailMsgOrTemplate);
      const source = fs.readFileSync(templatePath, 'utf-8');
      const template = handlebars.compile(source);
      // const compiledEmail = template(replacementsOrText);
      const compiledEmail = template({ ...defaultReplacements, ...replacementsOrText });

      mailOptions = {
        from: this.user,
        to: email,
        subject: mailSubject,
        html: compiledEmail,
        attachments: attachments ? attachments : undefined,
      };
    } else if (typeof replacementsOrText === 'string') {
      mailOptions = {
        from: this.user,
        to: email,
        subject: mailSubject,
        html: replacementsOrText,
        attachments: attachments ? attachments : undefined,
      };
    }

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async sendMail(email: string, mailSubject: string, message: string, attachments?): Promise<boolean> {
    const transporter = nodemailer.createTransport({
      host: this.host,
      port: Number(this.port),
      secure: false,
      auth: {
        user: this.user,
        pass: this.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: this.user,
      to: email,
      subject: mailSubject,
      text: message,
      attachments: attachments ? attachments : undefined,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      return true;
    } catch (error) {
      console.error('Error sending simple email:', error);
      return false;
    }
  }

  async checkAndConvertToString(field: any): Promise<string> {
    if (typeof field === 'string') {
      return field;
    }
    if (field === undefined || field === null) {
      return null;
    }
    return String(field);
  }
}
