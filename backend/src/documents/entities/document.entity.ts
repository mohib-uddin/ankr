import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity, Profile, Property, Folder } from '@entities';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { DocumentCategoryEnum } from '@types';

@Entity({ name: 'document' })
export class Document extends BaseEntity {
  @ApiProperty({ example: '2025_Tax_Return' })
  @Column({ type: 'varchar' })
  name: string;

  @ApiProperty({ enum: DocumentCategoryEnum, example: DocumentCategoryEnum.TAX })
  @Column({ type: 'varchar', default: DocumentCategoryEnum.IDENTITY })
  category: DocumentCategoryEnum;

  @ApiProperty({ example: 'uuid-of-property', nullable: true })
  @Column({ nullable: true })
  linkedPropertyId: string;

  @ManyToOne(() => Property, (property) => property.documents, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'linkedPropertyId' })
  property: Property;

  @ApiProperty({ example: ['Urgent', 'Tax', '2026'], type: [String] })
  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @ApiProperty({ example: 'Additional notes about this document...', nullable: true })
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ApiProperty({ example: '/uploads/documents/tax_return.pdf' })
  @Column({ type: 'varchar' })
  filePath: string;

  @ApiProperty({ example: 'uuid-of-folder', nullable: true })
  @Column({ nullable: true })
  folderId: string;

  @ManyToOne(() => Folder, (folder) => folder.documents, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'folderId' })
  folder: Folder;

  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @ApiProperty({ example: 'uuid-of-profile' })
  @Column()
  profileId: string;
}
