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
import { AccountsModule } from './accounts/accounts.module';
import { PropertiesModule } from './properties/properties.module';
import { BusinessesEntitiesModule } from './businesses-entities/businesses-entities.module';
import { RolesModule } from './roles/roles.module';
import { ProfileModule } from './profile/profile.module';
import { AssetsModule } from './assets/assets.module';
import { LiabilitiesModule } from './liabilities/liabilities.module';
import { IncomeModule } from './income/income.module';
import { DocumentsModule } from './documents/documents.module';
import { PackageTemplatesModule } from './package-templates/package-templates.module';
import { UserPackagesModule } from './user-packages/user-packages.module';

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
    AccountsModule,
    PropertiesModule,
    BusinessesEntitiesModule,
    RolesModule,
    ProfileModule,
    AssetsModule,
    LiabilitiesModule,
    IncomeModule,
    DocumentsModule,
    PackageTemplatesModule,
    UserPackagesModule,
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
