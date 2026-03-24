import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiMessage, ApiMessageData } from '@types';
import { Repository } from 'typeorm';
import { BusinessEntity } from '@entities';
import { SuccessResponseMessages } from '@messages';
import { CreateBusinessEntityDto, UpdateBusinessEntityDto } from '@dtos';

@Injectable()
export class BusinessesEntitiesService {
  constructor(
    @InjectRepository(BusinessEntity)
    private readonly businessEntityRepository: Repository<BusinessEntity>,
  ) {}

  async createBusinessEntity(createBusinessEntityDto: CreateBusinessEntityDto): Promise<ApiMessageData<BusinessEntity>> {
    const entity = this.businessEntityRepository.create(createBusinessEntityDto);
    const savedEntity = await this.businessEntityRepository.save(entity);
    return { message: SuccessResponseMessages.successGeneral, data: savedEntity };
  }

  async getBusinessEntitiesByProfileId(profileId: string): Promise<ApiMessageData<BusinessEntity[]>> {
    const entities = await this.businessEntityRepository.find({ where: { profileId } });
    return { message: SuccessResponseMessages.successGeneral, data: entities };
  }

  async getBusinessEntityById(id: string): Promise<ApiMessageData<BusinessEntity>> {
    const entity = await this.businessEntityRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Business Entity not found');
    return { message: SuccessResponseMessages.successGeneral, data: entity };
  }

  async updateBusinessEntity(id: string, updateBusinessEntityDto: UpdateBusinessEntityDto): Promise<ApiMessageData<BusinessEntity>> {
    await this.businessEntityRepository.update(id, updateBusinessEntityDto);
    const entity = await this.businessEntityRepository.findOne({ where: { id } });
    return { message: SuccessResponseMessages.successGeneral, data: entity };
  }

  async deleteBusinessEntity(id: string): Promise<ApiMessage> {
    await this.businessEntityRepository.delete(id);
    return { message: SuccessResponseMessages.successGeneral };
  }
}
