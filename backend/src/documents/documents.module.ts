import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document, Folder, Profile } from '@entities';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { storageProviderFactory } from '../common/providers';

@Module({
  imports: [TypeOrmModule.forFeature([Document, Folder, Profile])],
  providers: [
    DocumentsService,
    {
      provide: 'StorageProvider',
      useFactory: (configService: ConfigService) =>
        storageProviderFactory(configService.get('STORAGE_PROVIDER')),
      inject: [ConfigService],
    },
  ],
  controllers: [DocumentsController],
  exports: [DocumentsService],
})
 export class DocumentsModule {}


