import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class PackageDocumentDto {
  @ApiProperty({ example: "id-of-template-item" })
  @IsString()
  @IsNotEmpty()
  templateItemId: string;

  @ApiProperty({ example: "uuid-of-document" })
  @IsUUID()
  @IsNotEmpty()
  documentId: string;
}
