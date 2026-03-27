import { PartialType } from '@nestjs/swagger';
import { CreateOtherAssetDto } from './create-other-asset.dto';

export class UpdateOtherAssetDto extends PartialType(CreateOtherAssetDto) {}
