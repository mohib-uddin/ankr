import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { BusinessesEntitiesService } from './businesses-entities.service';
import { CreateBusinessesEntityDto, UpdateBusinessesEntityDto } from '@dtos';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerApiResponse } from '@decorators';
import { BusinessEntity } from '@entities';
import { Request } from 'express';

@ApiTags('Business Entities')
@Controller('businesses-entities')
export class BusinessesEntitiesController {
  constructor(private readonly businessesEntitiesService: BusinessesEntitiesService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Create a new business entity (linked to common profile)', type: BusinessEntity })
  createBusinessEntity(@Body() createBusinessesEntityDto: CreateBusinessesEntityDto) {
    return this.businessesEntitiesService.createBusinessEntity(createBusinessesEntityDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Retrieve all business entities for the current user', type: BusinessEntity })
  getBusinessEntities(@Req() req: Request) {
    return this.businessesEntitiesService.getBusinessEntities(req.user.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Retrieve a single business entity', type: BusinessEntity })
  getBusinessEntityById(@Param('id') id: string, @Req() req: Request) {
    return this.businessesEntitiesService.getBusinessEntityById(id, req.user.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Update a business entity', type: BusinessEntity })
  updateBusinessEntity(@Param('id') id: string, @Body() updateBusinessesEntityDto: UpdateBusinessesEntityDto) {
    return this.businessesEntitiesService.updateBusinessEntity(id, updateBusinessesEntityDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Remove a business entity' })
  deleteBusinessEntity(@Param('id') id: string) {
    return this.businessesEntitiesService.deleteBusinessEntity(id);
  }
}
