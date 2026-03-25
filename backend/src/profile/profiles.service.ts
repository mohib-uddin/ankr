import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiMessageData, ProfileTypeEnum } from '@types';
import { Repository, DataSource } from 'typeorm';
import { Profile, InvestorProfile, Account, Property, BusinessEntity, Asset, Liability, Income, User } from '@entities';
import { SuccessResponseMessages } from '@messages';
import { CompleteInvestorProfileDto } from './dto';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  async onboardInvestor(dto: CompleteInvestorProfileDto): Promise<ApiMessageData<User>> {
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
      const { accounts, properties, businessEntities, asset, liability, income, userId, ...investorProfileData } = dto;
      let investorProfile = await queryRunner.manager.findOne(InvestorProfile, { where: { profileId } });
      if (investorProfile) {
        await queryRunner.manager.update(InvestorProfile, investorProfile.id, { ...investorProfileData, profileId });
      } else {
        investorProfile = queryRunner.manager.create(InvestorProfile, { ...investorProfileData, profileId });
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
      const user = await this.userRepository.findOne({
        where: { id: dto.userId },
        select: ['id', 'firstName', 'lastName', 'email', 'password', 'isVerified', 'isActive'], // Explicitly select safe fields + password for comparison
        relations: [
          'profile',
          'profile.investorProfile',
          'profile.accounts',
          'profile.properties',
          'profile.businessEntities',
          'profile.asset',
          'profile.liability',
          'profile.income',
        ],
      });
      return { message: SuccessResponseMessages.successGeneral, data: user };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateInvestorProfile(dto: CompleteInvestorProfileDto): Promise<ApiMessageData<User>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Ensure Profile Exists
      const profile = await queryRunner.manager.findOne(Profile, {
        where: { userId: dto.userId },
      });

      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      if (profile.type !== ProfileTypeEnum.INVESTOR) {
        throw new BadRequestException('Invalid profile type');
      }

      const profileId = profile.id;

      // 2. Investor Profile (update only)
      const investorProfile = await queryRunner.manager.findOne(InvestorProfile, { where: { profileId } });

      if (!investorProfile) {
        throw new NotFoundException('Investor profile not found');
      }

      const { accounts, properties, businessEntities, asset, liability, income, userId: _userId, ...investorProfileData } = dto;

      await queryRunner.manager.update(InvestorProfile, investorProfile.id, {
        ...investorProfileData,
        profileId,
      });

      // =====================================================
      // 🔥 REPLACE STRATEGY STARTS HERE
      // =====================================================

      // 3. COLLECTIONS (DELETE → INSERT)

      // ACCOUNTS
      if (dto.accounts) {
        // delete all
        await queryRunner.manager.delete(Account, { profileId });

        // recreate
        const newAccounts = dto.accounts.map((item) =>
          queryRunner.manager.create(Account, {
            ...item,
            profileId,
          }),
        );

        await queryRunner.manager.save(Account, newAccounts);
      }

      // PROPERTIES
      if (dto.properties) {
        await queryRunner.manager.delete(Property, { profileId });

        const newItems = dto.properties.map((item) =>
          queryRunner.manager.create(Property, {
            ...item,
            profileId,
          }),
        );

        await queryRunner.manager.save(Property, newItems);
      }

      // BUSINESS ENTITIES
      if (dto.businessEntities) {
        await queryRunner.manager.delete(BusinessEntity, { profileId });

        const newItems = dto.businessEntities.map((item) =>
          queryRunner.manager.create(BusinessEntity, {
            ...item,
            profileId,
          }),
        );

        await queryRunner.manager.save(BusinessEntity, newItems);
      }

      // 4. SINGLETONS (DELETE → INSERT)

      // ASSET
      if (dto.asset) {
        await queryRunner.manager.delete(Asset, { profileId });

        await queryRunner.manager.save(
          Asset,
          queryRunner.manager.create(Asset, {
            ...dto.asset,
            profileId,
          }),
        );
      }

      // LIABILITY
      if (dto.liability) {
        await queryRunner.manager.delete(Liability, { profileId });

        await queryRunner.manager.save(
          Liability,
          queryRunner.manager.create(Liability, {
            ...dto.liability,
            profileId,
          }),
        );
      }

      // INCOME
      if (dto.income) {
        await queryRunner.manager.delete(Income, { profileId });

        await queryRunner.manager.save(
          Income,
          queryRunner.manager.create(Income, {
            ...dto.income,
            profileId,
          }),
        );
      }

      // =====================================================
      // COMMIT
      // =====================================================
      await queryRunner.commitTransaction();

      const user = await this.userRepository.findOne({
        where: { id: dto.userId },
        relations: [
          'profile',
          'profile.investorProfile',
          'profile.accounts',
          'profile.properties',
          'profile.businessEntities',
          'profile.asset',
          'profile.liability',
          'profile.income',
        ],
      });

      return {
        message: SuccessResponseMessages.successGeneral,
        data: user,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
