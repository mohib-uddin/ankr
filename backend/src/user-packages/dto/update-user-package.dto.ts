import { PartialType } from '@nestjs/swagger';
import { CreateUserPackageDto } from './create-user-package.dto';

export class UpdateUserPackageDto extends PartialType(CreateUserPackageDto) {}
