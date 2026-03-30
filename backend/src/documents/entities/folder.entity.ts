import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity, Profile, Document } from '@entities';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity({ name: 'folder' })
export class Folder extends BaseEntity {
  @ApiProperty({ example: 'Taxes', description: 'Folder name' })
  @Column({ type: 'varchar' })
  name: string;

  @ApiProperty({ example: 'uuid-of-parent-folder', nullable: true })
  @Column({ nullable: true })
  parentFolderId: string;

  @ManyToOne(() => Folder, (folder) => folder.children, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentFolderId' })
  parent: Folder;

  @OneToMany(() => Folder, (folder) => folder.parent)
  children: Folder[];

  @OneToMany(() => Document, (document) => document.folder)
  documents: Document[];

  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @ApiProperty({ example: 'uuid-of-profile' })
  @Column()
  profileId: string;
}
