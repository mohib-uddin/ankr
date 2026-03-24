import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity, Profile } from '@entities';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'property' })
export class Property extends BaseEntity {
  @ApiProperty({ example: '123 Oak Ave, Austin, TX' })
  @Column({ type: 'text' })
  address: string;

  @ApiProperty({ example: 'Single Family' })
  @Column({ type: 'varchar' })
  propertyType: string;

  @ApiProperty({ example: 450000.00 })
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  estimatedValue: number;

  @ApiProperty({ example: 320000.00 })
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  loanBalance: number;

  @ApiProperty({ example: 2500.00 })
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  monthlyRent: number;

  @ApiProperty({ example: 6.5 })
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  interestRate: number;

  @ApiProperty({ example: 1200.00 })
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  monthlyPayment: number;

  @ApiProperty({ example: 'First National Bank' })
  @Column({ type: 'varchar', nullable: true })
  lender: string;

  @ApiProperty({ example: '2025-12-01' })
  @Column({ type: 'date', nullable: true })
  maturityDate: Date;

  @ApiProperty({ example: 100 })
  @Column({ type: 'integer', default: 100 })
  ownershipPercentage: number;

  @ApiProperty({ example: 'path/to/mortgage.pdf' })
  @Column({ type: 'varchar', nullable: true })
  mortgageStatementUrl: string;

  @ManyToOne(() => Profile, (profile) => profile.properties)
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @ApiProperty({ example: 'uuid-of-profile' })
  @Column()
  profileId: string;
}
