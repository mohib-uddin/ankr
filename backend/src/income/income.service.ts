import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiMessage, ApiMessageData } from '@types';
import { Repository } from 'typeorm';
import { Income } from '@entities';
import { SuccessResponseMessages } from '@messages';
import { CreateIncomeDto, UpdateIncomeDto } from '@dtos';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
  ) {}

  async createIncome(createIncomeDto: CreateIncomeDto): Promise<ApiMessageData<Income>> {
    const income = this.incomeRepository.create(createIncomeDto);
    const savedIncome = await this.incomeRepository.save(income);
    return { message: SuccessResponseMessages.successGeneral, data: savedIncome };
  }

  async getIncomesByProfileId(profileId: string): Promise<ApiMessageData<Income[]>> {
    const incomes = await this.incomeRepository.find({ where: { profileId } });
    return { message: SuccessResponseMessages.successGeneral, data: incomes };
  }

  async getIncomeById(id: string): Promise<ApiMessageData<Income>> {
    const income = await this.incomeRepository.findOne({ where: { id } });
    if (!income) throw new NotFoundException('Income record not found');
    return { message: SuccessResponseMessages.successGeneral, data: income };
  }

  async updateIncome(id: string, updateIncomeDto: UpdateIncomeDto): Promise<ApiMessageData<Income>> {
    await this.incomeRepository.update(id, updateIncomeDto);
    const income = await this.incomeRepository.findOne({ where: { id } });
    return { message: SuccessResponseMessages.successGeneral, data: income };
  }

  async deleteIncome(id: string): Promise<ApiMessage> {
    await this.incomeRepository.delete(id);
    return { message: SuccessResponseMessages.successGeneral };
  }
}
