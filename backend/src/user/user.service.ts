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

  private readonly userFields = ['user.id', 'user.firstName', 'user.lastName', 'user.email'];
  async getUser(userId: string): Promise<ApiMessageData> {
    const fetchedUser = await this.userRepository.createQueryBuilder('user').select(this.userFields).where('user.id = :userId', { userId }).getOne();
    if (!fetchedUser) throw new NotFoundException(UserErrorMessages.userNotExists);
    return { message: SuccessResponseMessages.successGeneral, data: fetchedUser };
  }
}
