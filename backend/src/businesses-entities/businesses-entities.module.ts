import { Module } from '@nestjs/common';
import { BusinessesEntitiesService } from './businesses-entities.service';
import { BusinessesEntitiesController } from './businesses-entities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessEntity } from './entities/businesses-entity.entity';
import { Profile } from '../profile/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessEntity, Profile])],
  providers: [BusinessesEntitiesService],
  controllers: [BusinessesEntitiesController],
  exports: [BusinessesEntitiesService],
})
export class BusinessesEntitiesModule {}
