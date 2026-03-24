import { UpdateDateColumn, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class BaseEntity {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Creation timestamp' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Last update timestamp' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
