import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PackageTemplate } from './entities/package-template.entity';
import { CreatePackageTemplateDto, UpdatePackageTemplateDto, PaginationDto } from '@dtos';
import { ApiMessage, ApiMessageData, ApiMessageDataPagination } from '@types';
import { SuccessResponseMessages } from '@messages';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PackageTemplatesService {
  constructor(
    @InjectRepository(PackageTemplate)
    private readonly packageTemplateRepository: Repository<PackageTemplate>,
  ) {}

  async getAllTemplates(paginationDto: PaginationDto = {}): Promise<ApiMessageDataPagination<PackageTemplate>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [templates, total] = await this.packageTemplateRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' }
    });
    const lastPage = Math.ceil(total / limit);

    return { 
      message: SuccessResponseMessages.successGeneral, 
      data: templates,
      page,
      lastPage,
      total
    };
  }

  async getTemplateById(id: string): Promise<ApiMessageData<PackageTemplate>> {
    const template = await this.packageTemplateRepository.findOne({ where: { id } });
    if (!template) throw new NotFoundException('Package template not found');
    return { message: SuccessResponseMessages.successGeneral, data: template };
  }

  async createTemplate(dto: CreatePackageTemplateDto): Promise<ApiMessageData<PackageTemplate>> {
    // Auto-generate UUID for each item if not provided
    const itemsWithIds = (dto.items || []).map(item => ({
      ...item,
      id: item.id || uuidv4()
    }));

    const template = this.packageTemplateRepository.create({
      ...dto,
      items: itemsWithIds
    });
    const saved = await this.packageTemplateRepository.save(template);
    return { message: SuccessResponseMessages.successGeneral, data: saved };
  }

  async updateTemplate(id: string, dto: UpdatePackageTemplateDto): Promise<ApiMessageData<PackageTemplate>> {
    await this.packageTemplateRepository.update(id, dto);
    const updated = await this.packageTemplateRepository.findOne({ where: { id } });
    if (!updated) throw new NotFoundException('Package template not found');
    return { message: SuccessResponseMessages.successGeneral, data: updated };
  }

  async deleteTemplate(id: string): Promise<ApiMessage> {
    const result = await this.packageTemplateRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Package template not found');
    return { message: SuccessResponseMessages.successGeneral };
  }
}
