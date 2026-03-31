import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageTemplate } from './entities/package-template.entity';
import { PackageTemplatesService } from './package-templates.service';
import { PackageTemplatesController } from './package-templates.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PackageTemplate])],
  providers: [PackageTemplatesService],
  controllers: [PackageTemplatesController],
  exports: [PackageTemplatesService],
})
export class PackageTemplatesModule {}
