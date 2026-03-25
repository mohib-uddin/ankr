import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity, Profile } from '@entities';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity({ name: 'investor_profile' })
export class InvestorProfile extends BaseEntity {
  @ApiProperty({ example: 'Jane A. Smith', description: 'Full legal name' })
  @Column({ type: 'varchar' })
  fullLegalName: string;

  @ApiProperty({ example: '123 Main Street, New York', description: 'Primary address' })
  @Column({ type: 'text' })
  primaryAddress: string;

  @ApiProperty({ example: '(555) 000 - 0000', description: 'Phone number' })
  @Column({ type: 'varchar' })
  phone: string;

  @ApiProperty({ example: '***-**-****', description: 'Social security number' })
  @Column({ type: 'varchar' })
  ssn: string;

  // --- Disclosures (From Investor Profile Step 8) ---
  @ApiProperty({ description: 'Guarantor, co-maker, or endorser' })
  @Column({ type: 'boolean', default: false })
  isGuarantor: boolean;

  @ApiProperty({ description: 'Pending legal actions' })
  @Column({ type: 'boolean', default: false })
  hasLegalActions: boolean;

  @ApiProperty({ description: 'Filed for bankruptcy' })
  @Column({ type: 'boolean', default: false })
  hasFiledBankruptcy: boolean;

  @ApiProperty({ description: 'Obligated for support' })
  @Column({ type: 'boolean', default: false })
  isObligatedForSupport: boolean;

  @ApiProperty({ description: 'Pledged assets' })
  @Column({ type: 'boolean', default: false })
  hasPledgedAssets: boolean;

  @ApiProperty({ description: 'Foreclosures' })
  @Column({ type: 'boolean', default: false })
  hasForeclosures: boolean;

  @ApiProperty({ description: 'Party to lawsuit' })
  @Column({ type: 'boolean', default: false })
  isPartyToLawsuit: boolean;

  // --- Relations ---
  @Exclude()
  @OneToOne(() => Profile, (profile) => profile.investorProfile)
  @JoinColumn({ name: 'profileId' })
  @ApiProperty({ type: () => Profile })
  profile: Profile;

  @ApiProperty({ example: 'uuid-of-profile' })
  @Column()
  profileId: string;
}
