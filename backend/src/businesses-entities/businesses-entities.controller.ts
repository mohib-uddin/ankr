import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { BusinessesEntitiesService } from './businesses-entities.service';
import { CreateBusinessEntityDto, UpdateBusinessEntityDto } from '@dtos';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Business Entities')
@Controller('businesses-entities')
export class BusinessesEntitiesController {
  constructor(private readonly businessesEntitiesService: BusinessesEntitiesService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a new business entity (linked to common profile)' })
  createBusinessEntity(@Body() createBusinessEntityDto: CreateBusinessEntityDto) {
    return this.businessesEntitiesService.createBusinessEntity(createBusinessEntityDto);
  }

  @Get('profile/:profileId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all business entities for a specific common profile' })
  getBusinessEntitiesByProfileId(@Param('profileId') profileId: string) {
    return this.businessesEntitiesService.getBusinessEntitiesByProfileId(profileId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a single business entity' })
  getBusinessEntityById(@Param('id') id: string) {
    return this.businessesEntitiesService.getBusinessEntityById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a business entity' })
  updateBusinessEntity(@Param('id') id: string, @Body() updateBusinessEntityDto: UpdateBusinessEntityDto) {
    return this.businessesEntitiesService.updateBusinessEntity(id, updateBusinessEntityDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a business entity' })
  deleteBusinessEntity(@Param('id') id: string) {
    return this.businessesEntitiesService.deleteBusinessEntity(id);
  }
}
