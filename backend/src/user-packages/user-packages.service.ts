import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserPackage } from './entities/user-package.entity';
import { UserPackageStatus } from './types';
import { CreateUserPackageDto } from './dto';
import { Profile, PackageTemplate, Document } from '@entities';
import { ApiMessageData } from '@types';
import { SuccessResponseMessages } from '@messages';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserPackagesService {
  constructor(
    @InjectRepository(UserPackage)
    private readonly userPackageRepository: Repository<UserPackage>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(PackageTemplate)
    private readonly templateRepository: Repository<PackageTemplate>,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  /**
   * Creates or updates a user package based on a template.
   * Logic:
   * 1. Check if package for this template already exists (1 per user/template).
   * 2. Validate all provided documents (ownership, category match).
   * 3. Check if requirements are completely fulfilled.
   * 4. If fulfilled, finalize and generate shared link.
   * 5. If valid documents but incomplete, save as draft.
   */
  async createOrUpdatePackage(userId: string, dto: CreateUserPackageDto): Promise<ApiMessageData<UserPackage>> {
    const profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');

    const template = await this.templateRepository.findOne({ where: { id: dto.templateId } });
    if (!template) throw new NotFoundException('Template not found');

    // Map and inject templateId into document objects
    const pkgDocuments = (dto.documents || []).map(d => ({
        ...d,
        templateId: template.id
    }));
    const docIds = pkgDocuments.map(d => d.documentId);

    // Check if documents belong to user
    const dbDocs = docIds.length > 0 
      ? await this.documentRepository.find({ where: { id: In(docIds), profileId: profile.id } }) 
      : [];

    if (dbDocs.length !== docIds.length) {
      throw new BadRequestException('One or more document IDs are invalid or do not belong to you');
    }

    // 2. Validate Alignment with Template Requirements (Category Matching)
    for (const pkgDoc of pkgDocuments) {
      const templateItem = template.items.find(item => item.id === pkgDoc.templateItemId);
      if (!templateItem) {
        throw new BadRequestException(`Template item ID "${pkgDoc.templateItemId}" not found in template "${template.name}"`);
      }
      
      const dbDoc = dbDocs.find(d => d.id === pkgDoc.documentId);
      if (dbDoc.category !== templateItem.category) {
        throw new BadRequestException(`Document "${dbDoc.name}" belongs to category "${dbDoc.category}", but item "${templateItem.name}" requires "${templateItem.category}"`);
      }
    }

    // 3. Check for Fulfillment (Counts)
    let isFulfilled = true;
    for (const item of template.items) {
      const currentDocs = pkgDocuments.filter(d => d.templateItemId === item.id);
      if (currentDocs.length < item.minCount || currentDocs.length > item.maxCount) {
        isFulfilled = false;
      }
    }

    // 4. Upsert check (Only one package per template per user)
    let userPackage = await this.userPackageRepository.findOne({ 
      where: { profileId: profile.id, templateId: template.id } 
    });

    if (userPackage) {
      userPackage.name = dto.name;
      userPackage.documents = pkgDocuments;
    } else {
      userPackage = this.userPackageRepository.create({
        name: dto.name,
        profileId: profile.id,
        templateId: template.id,
        documents: pkgDocuments,
      });
    }

    // 5. Status, Security Code and Link Generation
    if (isFulfilled) {
      userPackage.status = UserPackageStatus.FINALIZED;

      // 1. Handle Security Code (Priority: Manual > Regenerate > Existing > Auto-generated)
      if (dto.securityCode) {
        userPackage.securityCode = dto.securityCode;
      } else if (dto.regenerateSecurityCode || !userPackage.securityCode) {
        userPackage.securityCode = this.generateSecurityCode();
      }

      // 2. Handle Shared Link (Regenerate or New)
      if (dto.regenerateLink || !userPackage.sharedLink) {
        userPackage.sharedLink = uuidv4();
      }

      // 3. Handle Expiration
      if (dto.expiresInDays) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + dto.expiresInDays);
        userPackage.expiresAt = expiryDate;
      } else if (!userPackage.expiresAt) {
        const defaultExpiry = new Date();
        defaultExpiry.setDate(defaultExpiry.getDate() + 30); // Default 30 days
        userPackage.expiresAt = defaultExpiry;
      }
    } else {
      userPackage.status = UserPackageStatus.DRAFT;
    }

    const saved = await this.userPackageRepository.save(userPackage);
    return { message: SuccessResponseMessages.successGeneral, data: saved };
  }

  async deletePackage(id: string, userId: string): Promise<ApiMessageData<null>> {
    const profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');

    const result = await this.userPackageRepository.delete({ id, profileId: profile.id });
    if (result.affected === 0) throw new NotFoundException('Package not found');

    return { message: SuccessResponseMessages.successGeneral, data: null };
  }

  async getUserPackages(userId: string): Promise<ApiMessageData<UserPackage[]>> {
    const profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');

    const packages = await this.userPackageRepository.find({ 
      where: { profileId: profile.id },
      relations: ['template']
    });
    return { message: SuccessResponseMessages.successGeneral, data: packages };
  }

  async getPackageByLink(sharedLink: string): Promise<UserPackage> {
    const userPackage = await this.userPackageRepository.findOne({ 
        where: { sharedLink },
        relations: ['template', 'profile']
    });

    if (!userPackage) throw new NotFoundException('Package link not valid');
    
    // Check for expiration
    if (userPackage.expiresAt && new Date() > userPackage.expiresAt) {
      throw new BadRequestException('This package link has expired');
    }

    return userPackage;
  }

  private generateSecurityCode(length = 8): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let retVal = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }
}
