import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiMessage, ApiMessageData } from '@types';
import { Repository } from 'typeorm';
import { Account } from '@entities';
import { SuccessResponseMessages } from '@messages';
import { CreateAccountDto, UpdateAccountDto } from '@dtos';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async createAccount(createAccountDto: CreateAccountDto): Promise<ApiMessageData<Account>> {
    const account = this.accountRepository.create(createAccountDto);
    const savedAccount = await this.accountRepository.save(account);
    return { message: SuccessResponseMessages.successGeneral, data: savedAccount };
  }

  async getAccountsByProfileId(profileId: string): Promise<ApiMessageData<Account[]>> {
    const accounts = await this.accountRepository.find({ where: { profileId } });
    return { message: SuccessResponseMessages.successGeneral, data: accounts };
  }

  async getAccountById(id: string): Promise<ApiMessageData<Account>> {
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
