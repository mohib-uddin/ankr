import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiMessage, ApiMessageData } from '@types';
import { Repository } from 'typeorm';
import { Liability, Profile } from '@entities';
import { SuccessResponseMessages } from '@messages';
import { CreateLiabilityDto, UpdateLiabilityDto } from '@dtos';

@Injectable()
export class LiabilitiesService {
  constructor(
    @InjectRepository(Liability)
    private readonly liabilityRepository: Repository<Liability>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async createLiability(createLiabilityDto: CreateLiabilityDto): Promise<ApiMessageData<Liability>> {
    const liability = this.liabilityRepository.create(createLiabilityDto);
    const savedLiability = await this.liabilityRepository.save(liability);
    return { message: SuccessResponseMessages.successGeneral, data: savedLiability };
  }

  /**
   * Get all liabilities.
   * If userId is provided, filters by that user's profile.
   * If userId is undefined (admin), returns all.
   */
  async getLiabilities(userId?: string): Promise<ApiMessageData<Liability[]>> {
    if (userId) {
      const profile = await this.profileRepository.findOne({ where: { userId } });
      if (!profile) throw new NotFoundException('Profile not found');
      const liabilities = await this.liabilityRepository.find({ where: { profileId: profile.id } });
      return { message: SuccessResponseMessages.successGeneral, data: liabilities };
    }
    const liabilities = await this.liabilityRepository.find();
    return { message: SuccessResponseMessages.successGeneral, data: liabilities };
  }

  /**
   * Get a single liability by id.
   * If userId is provided, validates ownership.
   */
  async getLiabilityById(id: string, userId?: string): Promise<ApiMessageData<Liability>> {
    if (userId) {
      const profile = await this.profileRepository.findOne({ where: { userId } });
      if (!profile) throw new NotFoundException('Profile not found');
      const liability = await this.liabilityRepository.findOne({ where: { id, profileId: profile.id } });
      if (!liability) throw new NotFoundException('Liability not found');
      return { message: SuccessResponseMessages.successGeneral, data: liability };
    }
    const liability = await this.liabilityRepository.findOne({ where: { id } });
    if (!liability) throw new NotFoundException('Liability not found');
    return { message: SuccessResponseMessages.successGeneral, data: liability };
  }

  async updateLiability(id: string, updateLiabilityDto: UpdateLiabilityDto): Promise<ApiMessageData<Liability>> {
    await this.liabilityRepository.update(id, updateLiabilityDto);
    const liability = await this.liabilityRepository.findOne({ where: { id } });
    return { message: SuccessResponseMessages.successGeneral, data: liability };
  }

  async deleteLiability(id: string): Promise<ApiMessage> {
    await this.liabilityRepository.delete(id);
    return { message: SuccessResponseMessages.successGeneral };
  }
}
