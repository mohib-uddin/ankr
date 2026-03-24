import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiMessage, ApiMessageData } from '@types';
import { Repository } from 'typeorm';
import { Liability } from '@entities';
import { SuccessResponseMessages } from '@messages';
import { CreateLiabilityDto, UpdateLiabilityDto } from '@dtos';

@Injectable()
export class LiabilitiesService {
  constructor(
    @InjectRepository(Liability)
    private readonly liabilityRepository: Repository<Liability>,
  ) {}

  async createLiability(createLiabilityDto: CreateLiabilityDto): Promise<ApiMessageData<Liability>> {
    const liability = this.liabilityRepository.create(createLiabilityDto);
    const savedLiability = await this.liabilityRepository.save(liability);
    return { message: SuccessResponseMessages.successGeneral, data: savedLiability };
  }

  async getLiabilitiesByProfileId(profileId: string): Promise<ApiMessageData<Liability[]>> {
    const liabilities = await this.liabilityRepository.find({ where: { profileId } });
    return { message: SuccessResponseMessages.successGeneral, data: liabilities };
  }

  async getLiabilityById(id: string): Promise<ApiMessageData<Liability>> {
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
