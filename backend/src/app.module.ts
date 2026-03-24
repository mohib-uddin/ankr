import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from '@config/configuration';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from '@guards/at.guard';
import { AuthModule } from './auth/auth.module';
import { dataSourceOptions } from './database/db-config';
import { UserModule } from './user/user.module';
import { LoggerModule } from './logger/logger.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    LoggerModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 100,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.ENVIRONMENT || 'development'}`,
      load: [configuration],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
