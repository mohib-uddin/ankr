import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dto';

export class GetUsersDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Search query filter' })
  query?: string;
}
