import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiMessageData } from '@types';
import { Repository } from 'typeorm';
import { User } from '@entities';
import { SuccessResponseMessages, UserErrorMessages } from '@messages';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUser(userId: string): Promise<ApiMessageData> {
    const fetchedUser = await this.userRepository.findOne({
      where: { id: userId },
      // Select safe fields, strictly avoiding password, verificationCode, and isPassCodeValid
      select: ['id', 'firstName', 'lastName', 'email', 'isVerified', 'isActive'],
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

    if (!fetchedUser) throw new NotFoundException(UserErrorMessages.userNotExists);

    return { message: SuccessResponseMessages.successGeneral, data: fetchedUser };
  }
}
