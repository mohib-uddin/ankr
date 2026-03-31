import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AppHelper } from '@helpers/app.helper';
import { AccessTokenStrategy } from '@strategies/access-token.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role, User } from '@entities';

import { UserPackagesModule } from 'src/user-packages/user-packages.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), JwtModule.register({}), UserPackagesModule],
  controllers: [AuthController],
  providers: [AccessTokenStrategy, AuthService, AppHelper],
})
export class AuthModule {}
