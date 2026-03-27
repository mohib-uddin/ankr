import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiMessage, ApiMessageData } from '@types';
import { Repository } from 'typeorm';
import { Property, Profile } from '@entities';
import { SuccessResponseMessages } from '@messages';
import { CreatePropertyDto, UpdatePropertyDto } from '@dtos';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async createProperty(createPropertyDto: CreatePropertyDto): Promise<ApiMessageData<Property>> {
    const property = this.propertyRepository.create(createPropertyDto);
    const savedProperty = await this.propertyRepository.save(property);
    return { message: SuccessResponseMessages.successGeneral, data: savedProperty };
  }

  /**
   * Get all properties.
   * If userId is provided, filters by that user's profile.
   * If userId is undefined (admin), returns all.
   */
  async getProperties(userId?: string): Promise<ApiMessageData<Property[]>> {
    if (userId) {
      const profile = await this.profileRepository.findOne({ where: { userId } });
      if (!profile) throw new NotFoundException('Profile not found');
      const properties = await this.propertyRepository.find({ where: { profileId: profile.id } });
      return { message: SuccessResponseMessages.successGeneral, data: properties };
    }
    const properties = await this.propertyRepository.find();
    return { message: SuccessResponseMessages.successGeneral, data: properties };
  }

  /**
   * Get a single property by id.
   * If userId is provided, validates ownership.
   */
  async getPropertyById(id: string, userId?: string): Promise<ApiMessageData<Property>> {
    if (userId) {
      const profile = await this.profileRepository.findOne({ where: { userId } });
      if (!profile) throw new NotFoundException('Profile not found');
      const property = await this.propertyRepository.findOne({ where: { id, profileId: profile.id } });
      if (!property) throw new NotFoundException('Property not found');
      return { message: SuccessResponseMessages.successGeneral, data: property };
    }
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
