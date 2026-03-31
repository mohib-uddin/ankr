import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPackage } from './entities/user-package.entity';
import { UserPackagesService } from './user-packages.service';
import { UserPackagesController } from './user-packages.controller';
import { Profile, PackageTemplate, Document } from '@entities';

@Module({
  imports: [TypeOrmModule.forFeature([UserPackage, Profile, PackageTemplate, Document])],
  providers: [UserPackagesService],
  controllers: [UserPackagesController],
  exports: [UserPackagesService],
})
export class UserPackagesModule {}
