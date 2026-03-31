import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Req, Query, UploadedFiles } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto, UpdatePropertyDto, PaginationQueryDto } from '@dtos';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { SwaggerApiResponse, ImagesUpload } from '@decorators';
import { Property } from '@entities';
import { Request } from 'express';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @ImagesUpload('images', 5)
  @SwaggerApiResponse({ description: 'Create a new property with images (multipart/form-data)', type: Property })
  createProperty(@Req() req: Request, @Body() createPropertyDto: CreatePropertyDto, @UploadedFiles() files: Express.Multer.File[]) {
    return this.propertiesService.createProperty(req.user.id, createPropertyDto, files);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Retrieve all properties for the current user', type: Property, isArray: true })
  getProperties(@Req() req: Request, @Query() query: PaginationQueryDto) {
    return this.propertiesService.getProperties(req.user.id, query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Retrieve a single property', type: Property })
  getPropertyById(@Param('id') id: string, @Req() req: Request) {
    return this.propertiesService.getPropertyById(id, req.user.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Update a property', type: Property })
  updateProperty(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto) {
    return this.propertiesService.updateProperty(id, updatePropertyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Remove a property' })
  deleteProperty(@Param('id') id: string) {
    return this.propertiesService.deleteProperty(id);
  }
}
