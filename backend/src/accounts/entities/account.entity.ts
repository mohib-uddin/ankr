import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity, Profile } from '@entities';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'account' })
export class Account extends BaseEntity {
  @ApiProperty({ example: 'Chase', description: 'Banking institution' })
  @Column({ type: 'varchar' })
  institution: string;

  @ApiProperty({ example: 'Saving Account', description: 'Type of account' })
  @Column({ type: 'varchar' })
  accountType: string;

  @ApiProperty({ example: 50000, description: 'Current account balance' })
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  currentBalance: number;

  @ApiProperty({ example: 'path/to/statement.pdf', description: 'URL to bank statement' })
  @Column({ type: 'varchar', nullable: true })
  statementUrl: string;

  @ManyToOne(() => Profile, (profile) => profile.accounts)
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @ApiProperty({ example: 'uuid-of-profile' })
  @Column()
  profileId: string;
}
