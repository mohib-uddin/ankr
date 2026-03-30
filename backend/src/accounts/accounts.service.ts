import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiMessage, ApiMessageData, ApiMessageDataPagination } from '@types';
import { Repository } from 'typeorm';
import { Account, Profile } from '@entities';
import { SuccessResponseMessages } from '@messages';
import { CreateAccountDto, UpdateAccountDto, PaginationDto } from '@dtos';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async createAccount(createAccountDto: CreateAccountDto): Promise<ApiMessageData<Account>> {
    const account = this.accountRepository.create(createAccountDto);
    const savedAccount = await this.accountRepository.save(account);
    return { message: SuccessResponseMessages.successGeneral, data: savedAccount };
  }

  /**
   * Get all accounts.
   * If userId is provided (user controller), filters by that user's profile.
   * If userId is undefined (admin controller), returns all accounts.
   */
  async getAccounts(userId?: string, paginationDto: PaginationDto = {}): Promise<ApiMessageDataPagination<Account>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const findOptions: any = {
      skip,
      take: limit,
      order: { createdAt: 'DESC' }
    };

    if (userId) {
      const profile = await this.profileRepository.findOne({ where: { userId } });
      if (!profile) throw new NotFoundException('Profile not found');
      findOptions.where = { profileId: profile.id };
    }

    const [accounts, total] = await this.accountRepository.findAndCount(findOptions);
    const lastPage = Math.ceil(total / limit);

    return { 
      message: SuccessResponseMessages.successGeneral, 
      data: accounts,
      page,
      lastPage,
      total
    };
  }

  /**
   * Get a single account by id.
   * If userId is provided, validates that the account belongs to that user's profile.
   */
  async getAccountById(id: string, userId?: string): Promise<ApiMessageData<Account>> {
    if (userId) {
      const profile = await this.profileRepository.findOne({ where: { userId } });
      if (!profile) throw new NotFoundException('Profile not found');
      const account = await this.accountRepository.findOne({ where: { id, profileId: profile.id } });
      if (!account) throw new NotFoundException('Account not found');
      return { message: SuccessResponseMessages.successGeneral, data: account };
    }
    const account = await this.accountRepository.findOne({ where: { id } });
    if (!account) throw new NotFoundException('Account not found');
    return { message: SuccessResponseMessages.successGeneral, data: account };
  }

  async updateAccount(id: string, updateAccountDto: UpdateAccountDto): Promise<ApiMessageData<Account>> {
    await this.accountRepository.update(id, updateAccountDto);
    const account = await this.accountRepository.findOne({ where: { id } });
    return { message: SuccessResponseMessages.successGeneral, data: account };
  }

  async deleteAccount(id: string): Promise<ApiMessage> {
    await this.accountRepository.delete(id);
    return { message: SuccessResponseMessages.successGeneral };
  }
}
