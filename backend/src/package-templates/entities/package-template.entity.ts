import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@entities';
import { ApiProperty } from '@nestjs/swagger';
import { PackageTemplateItem } from '../types';

@Entity({ name: 'package_template' })
export class PackageTemplate extends BaseEntity {
  @ApiProperty({ example: 'Mortgage Application' })
  @Column({ type: 'varchar' })
  name: string;

  @ApiProperty({ example: 'Template for standard mortgage application documents' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    example: [
      {
        name: "Driver's License",
        description: "Valid state driver's license",
        category: 'Identity',
        minCount: 1,
        maxCount: 1,
      },
    ],
  })
  @Column({ type: 'jsonb', default: [] })
  items: PackageTemplateItem[];
}
