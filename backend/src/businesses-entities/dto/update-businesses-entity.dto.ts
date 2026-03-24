import { PartialType } from '@nestjs/swagger';
import { CreateBusinessesEntityDto } from './create-businesses-entity.dto';

export class UpdateBusinessesEntityDto extends PartialType(CreateBusinessesEntityDto) {}
