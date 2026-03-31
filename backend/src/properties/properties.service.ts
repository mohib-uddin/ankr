import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiMessage, ApiMessageData, ApiMessageDataPagination, StorageProviderInterface } from '@types';
import { Repository } from 'typeorm';
import { Property, Profile } from '@entities';
import { SuccessResponseMessages } from '@messages';
import { CreatePropertyDto, UpdatePropertyDto, PaginationDto } from '@dtos';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @Inject('StorageProvider')
    private readonly storageProvider: StorageProviderInterface,
  ) {}

  async createProperty(userId: string, createPropertyDto: CreatePropertyDto, files: Express.Multer.File[] = []): Promise<ApiMessageData<Property>> {
    const profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');

    let imageUrls: string[] = [];
    if (files && files.length > 0) {
      imageUrls = await Promise.all(
        files.map(file => this.storageProvider.uploadFile(file))
      );
    }

    const property = this.propertyRepository.create({
      ...createPropertyDto,
      images: imageUrls,
      profileId: profile.id
    });
    const savedProperty = await this.propertyRepository.save(property);
    return { message: SuccessResponseMessages.successGeneral, data: savedProperty };
  }

  /**
   * Get all properties.
   * If userId is provided, filters by that user's profile.
   * If userId is undefined (admin), returns all.
   */
  async getProperties(userId?: string, paginationDto: PaginationDto = {}): Promise<ApiMessageDataPagination<Property>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const findOptions: any = {
      skip,
      take: limit,
      relations: ['documents'],
      order: { createdAt: 'DESC' }
    };

    if (userId) {
      const profile = await this.profileRepository.findOne({ where: { userId } });
      if (!profile) throw new NotFoundException('Profile not found');
      findOptions.where = { profileId: profile.id };
    }

    const [properties, total] = await this.propertyRepository.findAndCount(findOptions);
    const lastPage = Math.ceil(total / limit);

    return { 
      message: SuccessResponseMessages.successGeneral, 
      data: properties,
      page,
      lastPage,
      total
    };
  }

  /**
   * Get a single property by id.
   * If userId is provided, validates ownership.
   */
  async getPropertyById(id: string, userId?: string): Promise<ApiMessageData<Property>> {
    if (userId) {
      const profile = await this.profileRepository.findOne({ where: { userId } });
      if (!profile) throw new NotFoundException('Profile not found');
      const property = await this.propertyRepository.findOne({ 
        where: { id, profileId: profile.id },
        relations: ['documents']
      });
      if (!property) throw new NotFoundException('Property not found');
      return { message: SuccessResponseMessages.successGeneral, data: property };
    }
    const property = await this.propertyRepository.findOne({ where: { id }, relations: ['documents'] });
    if (!property) throw new NotFoundException('Property not found');
    return { message: SuccessResponseMessages.successGeneral, data: property };
  }

  async updateProperty(id: string, updatePropertyDto: UpdatePropertyDto): Promise<ApiMessageData<Property>> {
    await this.propertyRepository.update(id, updatePropertyDto);
    const property = await this.propertyRepository.findOne({ where: { id } });
    return { message: SuccessResponseMessages.successGeneral, data: property };
  }

  async deleteProperty(id: string): Promise<ApiMessage> {
    const property = await this.propertyRepository.findOne({ where: { id } });
    if (property && property.images) {
      for (const img of property.images) {
        await this.storageProvider.deleteFile(img);
      }
    }
    await this.propertyRepository.delete(id);
    return { message: SuccessResponseMessages.successGeneral };
  }
}
