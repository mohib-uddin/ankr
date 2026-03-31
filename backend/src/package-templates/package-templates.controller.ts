import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ParseUUIDPipe, Query } from '@nestjs/common';
import { PackageTemplatesService } from './package-templates.service';
import { CreatePackageTemplateDto, UpdatePackageTemplateDto, PaginationDto } from '@dtos';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerApiResponse, Public } from '@decorators';
import { PackageTemplate } from './entities/package-template.entity';

@ApiTags('Package Templates')
@Controller('package-templates')
export class PackageTemplatesController {
  constructor(private readonly packageTemplatesService: PackageTemplatesService) {}

  @Public() // Accessible for selection
  @Get()
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Fetch all package templates', type: PackageTemplate, isArray: true })
  getAllTemplates(@Query() paginationDto: PaginationDto) {
    return this.packageTemplatesService.getAllTemplates(paginationDto);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Retrieve a single package template', type: PackageTemplate })
  getTemplateById(@Param('id', ParseUUIDPipe) id: string) {
    return this.packageTemplatesService.getTemplateById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @SwaggerApiResponse({ description: 'Create a new package template', type: PackageTemplate })
  createTemplate(@Body() dto: CreatePackageTemplateDto) {
    return this.packageTemplatesService.createTemplate(dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Update a package template', type: PackageTemplate })
  updateTemplate(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePackageTemplateDto) {
    return this.packageTemplatesService.updateTemplate(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Remove a package template' })
  deleteTemplate(@Param('id', ParseUUIDPipe) id: string) {
    return this.packageTemplatesService.deleteTemplate(id);
  }
}
