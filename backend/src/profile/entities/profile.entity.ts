import { Entity, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { 
  BaseEntity, 
  User, 
  InvestorProfile, 
  Account, 
  Property, 
  BusinessEntity, 
  Asset, 
  Liability, 
  Income 
} from '@entities';
import { ApiProperty } from '@nestjs/swagger';
import { ProfileTypeEnum } from '@types';

@Entity({ name: 'profile' })
export class Profile extends BaseEntity {
  @ApiProperty({ enum: ProfileTypeEnum, example: ProfileTypeEnum.INVESTOR, description: 'Type of profile' })
  @Column({ type: 'varchar', default: ProfileTypeEnum.INVESTOR })
  type: ProfileTypeEnum;

  @ApiProperty({ type: () => User })
  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ example: 'uuid-of-user' })
  @Column()
  userId: string;

  @ApiProperty({ type: () => InvestorProfile })
  @OneToOne(() => InvestorProfile, (investorProfile) => investorProfile.profile)
  investorProfile: InvestorProfile;

  @ApiProperty({ type: () => [Account] })
  @OneToMany(() => Account, (account) => account.profile)
  accounts: Account[];

  @ApiProperty({ type: () => [Property] })
  @OneToMany(() => Property, (property) => property.profile)
  properties: Property[];

  @ApiProperty({ type: () => [BusinessEntity] })
  @OneToMany(() => BusinessEntity, (entity) => entity.profile)
  businessEntities: BusinessEntity[];

  @ApiProperty({ type: () => Asset })
  @OneToOne(() => Asset, (asset) => asset.profile)
  asset: Asset;

  @ApiProperty({ type: () => Liability })
  @OneToOne(() => Liability, (liability) => liability.profile)
  liability: Liability;

  @ApiProperty({ type: () => Income })
  @OneToOne(() => Income, (income) => income.profile)
  income: Income;
}
