import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity, Profile } from '@entities';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity({ name: 'income' })
export class Income extends BaseEntity {
  @ApiProperty({ example: 120000.00 })
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  primaryIncome: number;

  @ApiProperty({ example: 45000.00 })
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  rentalIncome: number;

  @ApiProperty({ example: 5000.00 })
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  otherIncome: number;

  @Exclude()
  @OneToOne(() => Profile, (profile) => profile.income)
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @ApiProperty({ example: 'uuid-of-profile' })
  @Column()
  profileId: string;
}
