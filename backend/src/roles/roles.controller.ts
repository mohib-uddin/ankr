import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiTags } from '@nestjs/swagger';
import { Public, SwaggerApiResponse } from '@decorators';
import { Role } from '@entities';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Retrieve all roles', type: Role })
  getRoles() {
    return this.rolesService.getRoles();
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Retrieve a single role', type: Role })
  getRoleById(@Param('id') id: string) {
    return this.rolesService.getRoleById(id);
  }
}
