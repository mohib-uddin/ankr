import { Controller, Get, Param } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // @Post()
  // @ApiOperation({ summary: 'Create a new role' })
  // createRole(@Body() createRoleDto: CreateRoleDto) {
  //   return this.rolesService.createRole(createRoleDto);
  // }

  @Get()
  @ApiOperation({ summary: 'Retrieve all roles' })
  getRoles() {
    return this.rolesService.getRoles();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single role' })
  getRoleById(@Param('id') id: string) {
    return this.rolesService.getRoleById(id);
  }

  // @Patch(':id')
  // @ApiOperation({ summary: 'Update a role' })
  // updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
  //   return this.rolesService.updateRole(id, updateRoleDto);
  // }

  // @Delete(':id')
  // @ApiOperation({ summary: 'Remove a role' })
  // deleteRole(@Param('id') id: string) {
  //   return this.rolesService.deleteRole(id);
  // }
}
