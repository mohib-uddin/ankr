import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity, Profile } from '@entities';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { AccountTypeEnum } from '@types';

@Entity({ name: 'account' })
export class Account extends BaseEntity {
  @ApiProperty({ example: 'Chase', description: 'Banking institution' })
  @Column({ type: 'varchar' })
  institution: string;

  @ApiProperty({ enum: AccountTypeEnum, example: AccountTypeEnum.CHECKING_ACCOUNT })
  @Column({ type: 'varchar', default: AccountTypeEnum.CHECKING_ACCOUNT })
  accountType: AccountTypeEnum;

  @ApiProperty({ example: 50000, description: 'Current account balance' })
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  currentBalance: number;

  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => Profile, (profile) => profile.accounts)
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @ApiProperty({ example: 'uuid-of-profile' })
  @Column()
  profileId: string;
}
