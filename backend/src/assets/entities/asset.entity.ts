import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity, Profile } from '@entities';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity({ name: 'asset' })
export class Asset extends BaseEntity {
  @ApiProperty({ example: 450000.00, description: 'Stocks, ETFs, mutual funds, retirement accounts' })
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  publicInvestmentsTotal: number;

  @ApiProperty({ example: 120000.00 })
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  privateInvestments: number;

  @ApiProperty({ example: 50000.00, description: 'Vehicles, art, collectibles, jewelry, etc.' })
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  otherAssets: number;

  @Exclude()
  @OneToOne(() => Profile, (profile) => profile.asset)
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @ApiProperty({ example: 'uuid-of-profile' })
  @Column()
  profileId: string;
}
