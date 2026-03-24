import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionHelper {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key: Buffer;

  constructor(private readonly configService: ConfigService) {
    const keyFromEnv = this.configService.get<string>('encryption.secretKey');
    if (!keyFromEnv || keyFromEnv.length !== 32) {
      throw new InternalServerErrorException('AES secret key must be 32 characters long');
    }
    this.key = Buffer.from(keyFromEnv);
  }

  encrypt(plainText: string): string {
    const iv = crypto.randomBytes(16); // AES block size for CBC is 16 bytes
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const ivBase64 = iv.toString('base64');
    return `${ivBase64}:${encrypted}`;
  }

  decrypt(encryptedData: string): string {
    const [ivBase64, encryptedText] = encryptedData.split(':');
    if (!ivBase64 || !encryptedText) {
      throw new InternalServerErrorException('Invalid encrypted format');
    }

    const iv = Buffer.from(ivBase64, 'base64');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
