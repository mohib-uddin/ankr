import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { Profile } from '../profile/entities/profile.entity';
import { storageProviderFactory } from '../common/providers';

@Module({
  imports: [TypeOrmModule.forFeature([Property, Profile])],
  providers: [
    PropertiesService,
    {
      provide: 'StorageProvider',
      useFactory: (configService: ConfigService) =>
        storageProviderFactory(configService.get('STORAGE_PROVIDER')),
      inject: [ConfigService],
    },
  ],
  controllers: [PropertiesController],
  exports: [PropertiesService],
})
export class PropertiesModule {}
