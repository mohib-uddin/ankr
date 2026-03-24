process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import { createDocument } from '@swagger/swagger';
import * as express from 'express';
import helmet from 'helmet';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
  const logger = app.get(LoggerService);
  app.useLogger(logger);
  app.enableCors();
  const configService = app.get(ConfigService);
  const appPrefix: string = configService.get<string>('app.prefix');
  const docsPrefix: string = configService.get<string>('app.docsPrefix');
  const swaggerUser: string = configService.get<string>('app.swaggerAuthUser');
  const swaggerPassword: string = configService.get<string>('app.swaggerAuthPassword');
  const storagePath: string = configService.get<string>('storage.path') || './media';
  app.setGlobalPrefix(appPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use('/api/media', express.static(storagePath));
  SwaggerModule.setup(docsPrefix, app, createDocument(app, docsPrefix, swaggerUser, swaggerPassword));
  const port: number = configService.get<number>('PORT');
  await app.listen(port);
}
bootstrap();
