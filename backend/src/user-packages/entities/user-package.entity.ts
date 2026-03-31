import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity, Profile, PackageTemplate } from '@entities';
import { ApiProperty } from '@nestjs/swagger';
import { UserPackageStatus, UserPackageDocument } from '../types';

@Entity({ name: 'user_package' })
export class UserPackage extends BaseEntity {
  @ApiProperty({ example: 'My Mortgage Docs' })
  @Column({ type: 'varchar' })
  name: string;

  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @Column()
  profileId: string;

  @ManyToOne(() => PackageTemplate, { createForeignKeyConstraints: false, nullable: true })
  @JoinColumn({ name: 'templateId' })
  template: PackageTemplate;

  @Column({ nullable: true })
  templateId: string;

  @ApiProperty({
    example: [
      {
        templateId: "uuid-of-template",
        templateItemName: "Driver's License",
        documentId: "uuid-of-document"
      }
    ]
  })
  @Column({ type: 'jsonb', default: [] })
  documents: UserPackageDocument[];

  @Column({ type: 'varchar', nullable: true })
  securityCode: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  sharedLink: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ type: 'varchar', default: UserPackageStatus.DRAFT })
  status: UserPackageStatus;
}
