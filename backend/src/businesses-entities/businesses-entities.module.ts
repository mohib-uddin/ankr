import { Module } from '@nestjs/common';
import { BusinessesEntitiesService } from './businesses-entities.service';
import { BusinessesEntitiesController } from './businesses-entities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessEntity } from './entities/businesses-entity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessEntity])],
  providers: [BusinessesEntitiesService],
  controllers: [BusinessesEntitiesController],
  exports: [BusinessesEntitiesService],
})
export class BusinessesEntitiesModule {}
