import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateFolderDto {
  @ApiProperty({ example: 'Taxes' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'uuid-of-parent-folder', required: false })
  @IsUUID()
  @IsOptional()
  parentFolderId?: string;

  @ApiProperty({ example: 'uuid-of-profile' })
  @IsUUID()
  @IsNotEmpty()
  profileId: string;
}

export class CreateFolderWithoutProfileDto extends OmitType(
  CreateFolderDto,
  ['profileId'] as const,
) {}
