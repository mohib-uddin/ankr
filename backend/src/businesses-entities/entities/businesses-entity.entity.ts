import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity, Profile } from '@entities';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity({ name: 'business_entity' })
export class BusinessEntity extends BaseEntity {
  @ApiProperty({ example: 'Smith Holding LLC' })
  @Column({ type: 'varchar' })
  entityName: string;

  @ApiProperty({ example: 100 })
  @Column({ type: 'integer', default: 100 })
  ownershipPercentage: number;

  @ApiProperty({ example: 450000.00 })
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  estimatedValue: number;

  @Exclude()
  @ManyToOne(() => Profile, (profile) => profile.businessEntities)
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @ApiProperty({ example: 'uuid-of-profile' })
  @Column()
  profileId: string;
}
