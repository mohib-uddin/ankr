import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Liability } from './entities/liability.entity';
import { LiabilitiesService } from './liabilities.service';
import { LiabilitiesController } from './liabilities.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Liability])],
  providers: [LiabilitiesService],
  controllers: [LiabilitiesController],
})
export class LiabilitiesModule {}
