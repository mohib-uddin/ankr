import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from './entities/income.entity';
import { Profile } from '../profile/entities/profile.entity';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Income, Profile])],
  providers: [IncomeService],
  controllers: [IncomeController],
})
export class IncomeModule {}
