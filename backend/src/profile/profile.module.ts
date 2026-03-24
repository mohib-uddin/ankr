import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
  Profile, 
  InvestorProfile, 
  Account, 
  Property, 
  BusinessEntity, 
  Asset, 
  Liability, 
  Income 
} from '@entities';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Profile, 
      InvestorProfile, 
      Account, 
      Property, 
      BusinessEntity, 
      Asset, 
      Liability, 
      Income
    ])
  ],
  providers: [ProfilesService],
  controllers: [ProfilesController],
  exports: [ProfilesService],
})
export class ProfileModule {}
