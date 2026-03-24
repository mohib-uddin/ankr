import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiMessageData, ProfileTypeEnum } from '@types';
import { Repository, DataSource } from 'typeorm';
import { Profile, InvestorProfile, Account, Property, BusinessEntity, Asset, Liability, Income } from '@entities';
import { SuccessResponseMessages } from '@messages';
import { CompleteInvestorProfileDto, CreateProfileDto, UpdateProfileDto, CreateInvestorProfileDto } from './dto';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(InvestorProfile)
    private readonly investorProfileRepository: Repository<InvestorProfile>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(BusinessEntity)
    private readonly businessEntityRepository: Repository<BusinessEntity>,
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    @InjectRepository(Liability)
    private readonly liabilityRepository: Repository<Liability>,
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
  ) {}

  async createFullInvestorProfile(dto: CompleteInvestorProfileDto): Promise<ApiMessageData<Profile>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Manage Common Profile
      let profile = await queryRunner.manager.findOne(Profile, { where: { userId: dto.userId } });
      if (!profile) {
        profile = queryRunner.manager.create(Profile, { userId: dto.userId, type: ProfileTypeEnum.INVESTOR });
        profile = await queryRunner.manager.save(profile);
      }

      const profileId = profile.id;

      // 2. InvestorProfile Extension (Step 1 & 8)
      let investorProfile = await queryRunner.manager.findOne(InvestorProfile, { where: { profileId } });
      if (investorProfile) {
        await queryRunner.manager.update(InvestorProfile, investorProfile.id, { ...dto.investorProfile, profileId });
      } else {
        investorProfile = queryRunner.manager.create(InvestorProfile, { ...dto.investorProfile, profileId });
        await queryRunner.manager.save(investorProfile);
      }

      // 3. Collection-based Steps
      if (dto.accounts) {
        for (const item of dto.accounts) {
          await queryRunner.manager.save(Account, queryRunner.manager.create(Account, { ...item, profileId }));
        }
      }
      if (dto.properties) {
        for (const item of dto.properties) {
          await queryRunner.manager.save(Property, queryRunner.manager.create(Property, { ...item, profileId }));
        }
      }
      if (dto.businessEntities) {
        for (const item of dto.businessEntities) {
          await queryRunner.manager.save(BusinessEntity, queryRunner.manager.create(BusinessEntity, { ...item, profileId }));
        }
      }

      // 4. Singleton-based Steps
      if (dto.asset) {
        const existing = await queryRunner.manager.findOne(Asset, { where: { profileId } });
        if (existing) await queryRunner.manager.update(Asset, existing.id, { ...dto.asset, profileId });
        else await queryRunner.manager.save(Asset, queryRunner.manager.create(Asset, { ...dto.asset, profileId }));
      }
      if (dto.liability) {
        const existing = await queryRunner.manager.findOne(Liability, { where: { profileId } });
        if (existing) await queryRunner.manager.update(Liability, existing.id, { ...dto.liability, profileId });
        else await queryRunner.manager.save(Liability, queryRunner.manager.create(Liability, { ...dto.liability, profileId }));
      }
      if (dto.income) {
        const existing = await queryRunner.manager.findOne(Income, { where: { profileId } });
        if (existing) await queryRunner.manager.update(Income, existing.id, { ...dto.income, profileId });
        else await queryRunner.manager.save(Income, queryRunner.manager.create(Income, { ...dto.income, profileId }));
      }

      await queryRunner.commitTransaction();
      return this.getProfileByUserId(dto.userId);

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getProfileByUserId(userId: string): Promise<ApiMessageData<Profile>> {
    const profile = await this.profileRepository.findOne({ 
      where: { userId },
      relations: [
        'investorProfile',
        'accounts',
        'properties',
        'businessEntities',
        'asset',
        'liability',
        'income'
      ]
    });
    if (!profile) throw new NotFoundException('Profile not found');
    return { message: SuccessResponseMessages.successGeneral, data: profile };
  }

  async createProfile(createProfileDto: CreateProfileDto): Promise<ApiMessageData<Profile>> {
    const profile = this.profileRepository.create(createProfileDto);
    const savedProfile = await this.profileRepository.save(profile);
    return { message: SuccessResponseMessages.successGeneral, data: savedProfile };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<ApiMessageData<Profile>> {
    const profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');
    await this.profileRepository.update(profile.id, updateProfileDto);
    const updatedProfile = await this.profileRepository.findOne({ where: { userId }, relations: ['investorProfile'] });
    return { message: SuccessResponseMessages.successGeneral, data: updatedProfile };
  }

  // --- Investor Profile Individual step (Add back missed method) ---
  async createInvestorProfile(profileId: string, dto: CreateInvestorProfileDto): Promise<ApiMessageData<InvestorProfile>> {
    const profile = await this.profileRepository.findOne({ where: { id: profileId } });
    if (!profile) throw new NotFoundException('Common Profile not found');

    const investorProfile = this.investorProfileRepository.create({ ...dto, profileId });
    const saved = await this.investorProfileRepository.save(investorProfile);
    return { message: SuccessResponseMessages.successGeneral, data: saved };
  }
}
