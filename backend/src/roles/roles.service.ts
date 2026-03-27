import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiMessageData } from '@types';
import { Repository } from 'typeorm';
import { Role } from '@entities';
import { SuccessResponseMessages } from '@messages';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  // async createRole(createRoleDto: CreateRoleDto): Promise<ApiMessageData<Role>> {
  //   const { name, key } = createRoleDto;
  //   const roleKey = key || name.toUpperCase().replace(/\s+/g, '_');
  //   const role = this.roleRepository.create({ ...createRoleDto, key: roleKey });
  //   const savedRole = await this.roleRepository.save(role);
  //   return { message: SuccessResponseMessages.successGeneral, data: savedRole };
  // }

  async getRoles(): Promise<ApiMessageData<Role[]>> {
    const roles = await this.roleRepository.find();
    return { message: SuccessResponseMessages.successGeneral, data: roles };
  }

  async getRoleById(roleId: string): Promise<ApiMessageData<Role>> {
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) throw new NotFoundException('Role not found');
    return { message: SuccessResponseMessages.successGeneral, data: role };
  }

  // async updateRole(roleId: string, updateRoleDto: UpdateRoleDto): Promise<ApiMessageData<Role>> {
  //   await this.roleRepository.update(roleId, updateRoleDto);
  //   const role = await this.roleRepository.findOne({ where: { id: roleId } });
  //   return { message: SuccessResponseMessages.successGeneral, data: role };
  // }

  // async deleteRole(roleId: string): Promise<ApiMessageData> {
  //   await this.roleRepository.delete(roleId);
  //   return { message: SuccessResponseMessages.successGeneral };
  // }
}
