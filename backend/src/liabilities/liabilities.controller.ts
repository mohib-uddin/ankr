import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { LiabilitiesService } from './liabilities.service';
import { CreateLiabilityDto, UpdateLiabilityDto } from '@dtos';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerApiResponse } from '@decorators';
import { Liability } from '@entities';
import { Request } from 'express';

@ApiTags('Liabilities')
@Controller('liabilities')
export class LiabilitiesController {
  constructor(private readonly liabilitiesService: LiabilitiesService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Create a new liability entry (linked to common profile)', type: Liability })
  createLiability(@Body() createLiabilityDto: CreateLiabilityDto) {
    return this.liabilitiesService.createLiability(createLiabilityDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Retrieve all liabilities for the current user', type: Liability })
  getLiabilities(@Req() req: Request) {
    return this.liabilitiesService.getLiabilities(req.user.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Retrieve a single liability', type: Liability })
  getLiabilityById(@Param('id') id: string, @Req() req: Request) {
    return this.liabilitiesService.getLiabilityById(id, req.user.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Update a liability', type: Liability })
  updateLiability(@Param('id') id: string, @Body() updateLiabilityDto: UpdateLiabilityDto) {
    return this.liabilitiesService.updateLiability(id, updateLiabilityDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Remove a liability' })
  deleteLiability(@Param('id') id: string) {
    return this.liabilitiesService.deleteLiability(id);
  }
}
