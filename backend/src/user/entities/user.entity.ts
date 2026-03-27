import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity, Role, Profile } from '@entities';
import { Exclude } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @ApiProperty({ example: 'John', description: 'User first name' })
  @Column({ type: 'varchar' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  @Column({ type: 'varchar' })
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Unique email address' })
  @Column({ type: 'varchar', unique: true })
  email: string;

  @Exclude()
  @ApiHideProperty()
  @Column({ type: 'varchar', nullable: true, select: false })
  password: string;

  @ApiProperty({ example: true, description: 'True if email is verified' })
  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Exclude()
  @ApiHideProperty()
  @Column({ type: 'varchar', default: '', select: false })
  verificationCode: string;

  @Exclude()
  @ApiHideProperty()
  @Column({ type: 'boolean', default: false, select: false })
  isPassCodeValid: boolean;

  @ApiProperty({ example: true, description: 'True if account is active' })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({ example: 'https://example.com/profiles/john.jpg', description: 'URL to the user avatar', required: false })
  @Column({ type: 'varchar', nullable: true })
  picture: string;

  @ApiProperty({ type: () => Role })
  @ManyToOne(() => Role)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @ApiProperty({ example: 'uuid-of-role' })
  @Column({ nullable: true })
  roleId: string;

  @ApiProperty({ type: () => Profile })
  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;
}
