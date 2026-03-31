import { Controller, Get, Post, Body, Delete, Param, HttpCode, HttpStatus, Req, ParseUUIDPipe } from '@nestjs/common';
import { UserPackagesService } from './user-packages.service';
import { CreateUserPackageDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerApiResponse } from '@decorators';
import { UserPackage } from './entities/user-package.entity';
import { Request } from 'express';

@ApiTags('User Packages')
@Controller('user-packages')
export class UserPackagesController {
  constructor(private readonly userPackagesService: UserPackagesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Fetch your document packages', type: UserPackage, isArray: true })
  getUserPackages(@Req() req: Request) {
    return this.userPackagesService.getUserPackages(req.user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @SwaggerApiResponse({ description: 'Create or update a document package draft/link', type: UserPackage })
  createUserPackage(@Req() req: Request, @Body() dto: CreateUserPackageDto) {
    return this.userPackagesService.createOrUpdatePackage(req.user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Delete a document package' })
  deletePackage(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.userPackagesService.deletePackage(id, req.user.id);
  }
}
