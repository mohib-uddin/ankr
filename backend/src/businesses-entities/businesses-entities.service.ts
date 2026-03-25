import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiMessage, ApiMessageData } from '@types';
import { Repository } from 'typeorm';
import { BusinessEntity, Profile } from '@entities';
import { SuccessResponseMessages } from '@messages';
import { CreateBusinessesEntityDto, UpdateBusinessesEntityDto } from '@dtos';

@Injectable()
export class BusinessesEntitiesService {
  constructor(
    @InjectRepository(BusinessEntity)
    private readonly businessEntityRepository: Repository<BusinessEntity>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async createBusinessEntity(createBusinessEntityDto: CreateBusinessesEntityDto): Promise<ApiMessageData<BusinessEntity>> {
    const entity = this.businessEntityRepository.create(createBusinessEntityDto);
    const savedEntity = await this.businessEntityRepository.save(entity);
    return { message: SuccessResponseMessages.successGeneral, data: savedEntity };
  }

  /**
   * Get all business entities.
   * If userId is provided, filters by that user's profile.
   * If userId is undefined (admin), returns all.
   */
  async getBusinessEntities(userId?: string): Promise<ApiMessageData<BusinessEntity[]>> {
    if (userId) {
      const profile = await this.profileRepository.findOne({ where: { userId } });
      if (!profile) throw new NotFoundException('Profile not found');
      const entities = await this.businessEntityRepository.find({ where: { profileId: profile.id } });
      return { message: SuccessResponseMessages.successGeneral, data: entities };
    }
    const entities = await this.businessEntityRepository.find();
    return { message: SuccessResponseMessages.successGeneral, data: entities };
  }

  /**
   * Get a single business entity by id.
   * If userId is provided, validates ownership.
   */
  async getBusinessEntityById(id: string, userId?: string): Promise<ApiMessageData<BusinessEntity>> {
    if (userId) {
      const profile = await this.profileRepository.findOne({ where: { userId } });
      if (!profile) throw new NotFoundException('Profile not found');
      const entity = await this.businessEntityRepository.findOne({ where: { id, profileId: profile.id } });
      if (!entity) throw new NotFoundException('Business Entity not found');
      return { message: SuccessResponseMessages.successGeneral, data: entity };
    }
    const entity = await this.businessEntityRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Business Entity not found');
    return { message: SuccessResponseMessages.successGeneral, data: entity };
  }

  async updateBusinessEntity(id: string, updateBusinessEntityDto: UpdateBusinessesEntityDto): Promise<ApiMessageData<BusinessEntity>> {
    await this.businessEntityRepository.update(id, updateBusinessEntityDto);
    const entity = await this.businessEntityRepository.findOne({ where: { id } });
    return { message: SuccessResponseMessages.successGeneral, data: entity };
  }

  async deleteBusinessEntity(id: string): Promise<ApiMessage> {
    await this.businessEntityRepository.delete(id);
    return { message: SuccessResponseMessages.successGeneral };
  }
}
