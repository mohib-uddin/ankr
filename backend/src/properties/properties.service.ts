import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiMessage, ApiMessageData } from '@types';
import { Repository } from 'typeorm';
import { Property } from '@entities';
import { SuccessResponseMessages } from '@messages';
import { CreatePropertyDto, UpdatePropertyDto } from '@dtos';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  async createProperty(createPropertyDto: CreatePropertyDto): Promise<ApiMessageData<Property>> {
    const property = this.propertyRepository.create(createPropertyDto);
    const savedProperty = await this.propertyRepository.save(property);
    return { message: SuccessResponseMessages.successGeneral, data: savedProperty };
  }

  async getPropertiesByProfileId(profileId: string): Promise<ApiMessageData<Property[]>> {
    const properties = await this.propertyRepository.find({ where: { profileId } });
    return { message: SuccessResponseMessages.successGeneral, data: properties };
  }

  async getPropertyById(id: string): Promise<ApiMessageData<Property>> {
    const property = await this.propertyRepository.findOne({ where: { id } });
    if (!property) throw new NotFoundException('Property not found');
    return { message: SuccessResponseMessages.successGeneral, data: property };
  }

  async updateProperty(id: string, updatePropertyDto: UpdatePropertyDto): Promise<ApiMessageData<Property>> {
    await this.propertyRepository.update(id, updatePropertyDto);
    const property = await this.propertyRepository.findOne({ where: { id } });
    return { message: SuccessResponseMessages.successGeneral, data: property };
  }

  async deleteProperty(id: string): Promise<ApiMessage> {
    await this.propertyRepository.delete(id);
    return { message: SuccessResponseMessages.successGeneral };
  }
}
