import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { LiabilitiesService } from './liabilities.service';
import { CreateLiabilityDto, UpdateLiabilityDto } from '@dtos';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Liabilities')
@Controller('liabilities')
export class LiabilitiesController {
  constructor(private readonly liabilitiesService: LiabilitiesService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a new liability entry (linked to common profile)' })
  createLiability(@Body() createLiabilityDto: CreateLiabilityDto) {
    return this.liabilitiesService.createLiability(createLiabilityDto);
  }

  @Get('profile/:profileId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all liabilities for a specific common profile' })
  getLiabilitiesByProfileId(@Param('profileId') profileId: string) {
    return this.liabilitiesService.getLiabilitiesByProfileId(profileId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a single liability' })
  getLiabilityById(@Param('id') id: string) {
    return this.liabilitiesService.getLiabilityById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a liability' })
  updateLiability(@Param('id') id: string, @Body() updateLiabilityDto: UpdateLiabilityDto) {
    return this.liabilitiesService.updateLiability(id, updateLiabilityDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a liability' })
  deleteLiability(@Param('id') id: string) {
    return this.liabilitiesService.deleteLiability(id);
  }
}
