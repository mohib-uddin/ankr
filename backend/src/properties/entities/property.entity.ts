import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity, Profile, Document } from '@entities';
import { ApiProperty } from '@nestjs/swagger';
import { PropertyTypeEnum, PropertyStatusEnum } from '@types';
import { Exclude } from 'class-transformer';

@Entity({ name: 'property' })
export class Property extends BaseEntity {
  @ApiProperty({ example: 'Westlake Commons' })
  @Column({ type: 'varchar', nullable: true })
  name: string;

  @ApiProperty({ example: '123 Oak Ave, Austin, TX' })
  @Column({ type: 'text' })
  address: string;

  @ApiProperty({ example: 'Austin' })
  @Column({ type: 'varchar', nullable: true })
  city: string;

  @ApiProperty({ example: 'TX' })
  @Column({ type: 'varchar', nullable: true })
  state: string;

  @ApiProperty({ example: '78701' })
  @Column({ type: 'varchar', nullable: true })
  zipCode: string;

  @ApiProperty({ enum: PropertyTypeEnum, example: PropertyTypeEnum.SINGLE_FAMILY })
  @Column({ type: 'varchar', default: PropertyTypeEnum.SINGLE_FAMILY })
  propertyType: PropertyTypeEnum;

  @ApiProperty({ enum: PropertyStatusEnum, example: PropertyStatusEnum.ACQUISITION })
  @Column({ type: 'varchar', default: PropertyStatusEnum.ACQUISITION, nullable: true })
  currentStatus: PropertyStatusEnum;

  @ApiProperty({ example: 20000 })
  @Column({ type: 'integer', nullable: true })
  grossSqFt: number;

  @ApiProperty({ example: 1 })
  @Column({ type: 'integer', nullable: true, name: 'units_doors' })
  unitsDoors: number;

  @ApiProperty({ example: 2005 })
  @Column({ type: 'integer', nullable: true })
  yearBuilt: number;

  @ApiProperty({ example: 0.5 })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  lotSizeAcres: number;

  @ApiProperty({ example: 'R1, MF-4, C-2' })
  @Column({ type: 'text', nullable: true })
  zoning: string;

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

  @ApiProperty({ example: ['ext-slug-1.jpg', 'ext-slug-2.jpg'] })
  @Column({ type: 'text', array: true, nullable: true })
  images: string[];

  @Exclude()
  @ManyToOne(() => Profile, (profile) => profile.properties)
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @ApiProperty({ example: 'uuid-of-profile' })
  @Column()
  profileId: string;

  @OneToMany(() => Document, (document) => document.property)
  documents: Document[];
}
