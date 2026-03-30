import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiMessage, ApiMessageData, ApiMessageDataPagination } from '@types';
import { Repository } from 'typeorm';
import { Liability, Profile } from '@entities';
import { SuccessResponseMessages } from '@messages';
import { CreateLiabilityDto, UpdateLiabilityDto, PaginationDto } from '@dtos';

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
  async getLiabilities(userId?: string, paginationDto: PaginationDto = {}): Promise<ApiMessageDataPagination<Liability>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const findOptions: any = {
      skip,
      take: limit,
      order: { createdAt: 'DESC' }
    };

    if (userId) {
      const profile = await this.profileRepository.findOne({ where: { userId } });
      if (!profile) throw new NotFoundException('Profile not found');
      findOptions.where = { profileId: profile.id };
    }

    const [liabilities, total] = await this.liabilityRepository.findAndCount(findOptions);
    const lastPage = Math.ceil(total / limit);

    return { 
      message: SuccessResponseMessages.successGeneral, 
      data: liabilities,
      page,
      lastPage,
      total
    };
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
