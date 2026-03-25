import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity, Profile } from '@entities';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity({ name: 'liability' })
export class Liability extends BaseEntity {
  @ApiProperty({ example: 12000.00 })
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  creditCardsTotal: number;

  @ApiProperty({ example: 15000.00 })
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  personalLoans: number;

  @ApiProperty({ example: 5000.00 })
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  otherDebt: number;

  @ApiProperty({ example: 'Chase Auto Loan', description: 'Link other debt to specific assets if applicable' })
  @Column({ type: 'varchar', nullable: true, default: 'None' })
  linkedAsset: string;

  @Exclude()
  @OneToOne(() => Profile, (profile) => profile.liability)
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @ApiProperty({ example: 'uuid-of-profile' })
  @Column()
  profileId: string;
}
