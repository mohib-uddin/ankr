import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiMessage, ApiMessageData } from '@types';
import { Repository } from 'typeorm';
import { Income, Profile } from '@entities';
import { SuccessResponseMessages } from '@messages';
import { CreateIncomeDto, UpdateIncomeDto } from '@dtos';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async createIncome(createIncomeDto: CreateIncomeDto): Promise<ApiMessageData<Income>> {
    const income = this.incomeRepository.create(createIncomeDto);
    const savedIncome = await this.incomeRepository.save(income);
    return { message: SuccessResponseMessages.successGeneral, data: savedIncome };
  }

  /**
   * Get all income records.
   * If userId is provided, filters by that user's profile.
   * If userId is undefined (admin), returns all.
   */
  async getIncomes(userId?: string): Promise<ApiMessageData<Income[]>> {
    if (userId) {
      const profile = await this.profileRepository.findOne({ where: { userId } });
      if (!profile) throw new NotFoundException('Profile not found');
      const incomes = await this.incomeRepository.find({ where: { profileId: profile.id } });
      return { message: SuccessResponseMessages.successGeneral, data: incomes };
    }
    const incomes = await this.incomeRepository.find();
    return { message: SuccessResponseMessages.successGeneral, data: incomes };
  }

  /**
   * Get a single income record by id.
   * If userId is provided, validates ownership.
   */
  async getIncomeById(id: string, userId?: string): Promise<ApiMessageData<Income>> {
    if (userId) {
      const profile = await this.profileRepository.findOne({ where: { userId } });
      if (!profile) throw new NotFoundException('Profile not found');
      const income = await this.incomeRepository.findOne({ where: { id, profileId: profile.id } });
      if (!income) throw new NotFoundException('Income record not found');
      return { message: SuccessResponseMessages.successGeneral, data: income };
    }
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
