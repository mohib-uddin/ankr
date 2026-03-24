import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@entities';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'role' })
export class Role extends BaseEntity {
  @ApiProperty({ example: 'INVESTOR', description: 'Unique identity key for conditions. Non-changeable.' })
  @Column({ type: 'varchar', unique: true })
  key: string;

  @ApiProperty({ example: 'Investor', description: 'Display name of the role. Changeable.' })
  @Column({ type: 'varchar' })
  name: string;

  @ApiProperty({ example: 'Individual Investor Profile', description: 'Description of the role' })
  @Column({ type: 'varchar', nullable: true })
  description: string;
}
