import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiMessage, ApiMessageData } from '@types';
import { Repository } from 'typeorm';
import { Asset } from '@entities';
import { SuccessResponseMessages } from '@messages';
import { CreateAssetDto, UpdateAssetDto } from '@dtos';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) {}

  async createAsset(createAssetDto: CreateAssetDto): Promise<ApiMessageData<Asset>> {
    const asset = this.assetRepository.create(createAssetDto);
    const savedAsset = await this.assetRepository.save(asset);
    return { message: SuccessResponseMessages.successGeneral, data: savedAsset };
  }

  async getAssetsByProfileId(profileId: string): Promise<ApiMessageData<Asset[]>> {
    const assets = await this.assetRepository.find({ where: { profileId } });
    return { message: SuccessResponseMessages.successGeneral, data: assets };
  }

  async getAssetById(id: string): Promise<ApiMessageData<Asset>> {
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
