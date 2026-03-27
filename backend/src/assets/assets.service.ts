import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiMessage, ApiMessageData } from '@types';
import { Repository } from 'typeorm';
import { Asset, Profile } from '@entities';
import { SuccessResponseMessages } from '@messages';
import { CreateAssetDto, UpdateAssetDto } from '@dtos';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async createAsset(createAssetDto: CreateAssetDto): Promise<ApiMessageData<Asset>> {
    const asset = this.assetRepository.create(createAssetDto);
    const savedAsset = await this.assetRepository.save(asset);
    return { message: SuccessResponseMessages.successGeneral, data: savedAsset };
  }

  /**
   * Get all assets.
   * If userId is provided (user controller), filters by that user's profile.
   * If userId is undefined (admin controller), returns all assets.
   */
  async getAssets(userId?: string): Promise<ApiMessageData<Asset[]>> {
    if (userId) {
      const profile = await this.profileRepository.findOne({ where: { userId } });
      if (!profile) throw new NotFoundException('Profile not found');
      const assets = await this.assetRepository.find({ where: { profileId: profile.id } });
      return { message: SuccessResponseMessages.successGeneral, data: assets };
    }
    const assets = await this.assetRepository.find();
    return { message: SuccessResponseMessages.successGeneral, data: assets };
  }

  /**
   * Get a single asset by id.
   * If userId is provided, validates that the asset belongs to that user's profile.
   */
  async getAssetById(id: string, userId?: string): Promise<ApiMessageData<Asset>> {
    if (userId) {
      const profile = await this.profileRepository.findOne({ where: { userId } });
      if (!profile) throw new NotFoundException('Profile not found');
      const asset = await this.assetRepository.findOne({ where: { id, profileId: profile.id } });
      if (!asset) throw new NotFoundException('Asset entry not found');
      return { message: SuccessResponseMessages.successGeneral, data: asset };
    }
    const asset = await this.assetRepository.findOne({ where: { id } });
    if (!asset) throw new NotFoundException('Asset entry not found');
    return { message: SuccessResponseMessages.successGeneral, data: asset };
  }

  async updateAsset(id: string, updateAssetDto: UpdateAssetDto): Promise<ApiMessageData<Asset>> {
    await this.assetRepository.update(id, updateAssetDto);
    const asset = await this.assetRepository.findOne({ where: { id } });
    return { message: SuccessResponseMessages.successGeneral, data: asset };
  }

  async deleteAsset(id: string): Promise<ApiMessage> {
    await this.assetRepository.delete(id);
    return { message: SuccessResponseMessages.successGeneral };
  }
}
