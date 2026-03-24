import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity, User } from '@entities';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'other_asset' })
export class OtherAsset extends BaseEntity {
  @ApiProperty({ example: 450000.00, description: 'Stocks, ETFs, mutual funds, retirement accounts' })
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  publicInvestmentsTotal: number;

  @ApiProperty({ example: 120000.00, description: 'Private equity, venture, angel investments' })
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  privateInvestments: number;

  @ApiProperty({ example: 50000.00, description: 'Vehicles, art, collectibles, jewelry, etc.' })
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  otherAssets: number;

  @ApiProperty({ example: 'path/to/brokerage.pdf', description: 'URL to brokerage statement' })
  @Column({ type: 'varchar', nullable: true })
  brokerageStatementUrl: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;
}
