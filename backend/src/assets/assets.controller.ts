import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Req, Query } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto, UpdateAssetDto, PaginationQueryDto } from '@dtos';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerApiResponse } from '@decorators';
import { Asset } from '@entities';
import { Request } from 'express';

@ApiTags('Assets')
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Create a new asset entry (linked to common profile)', type: Asset })
  createAsset(@Body() createAssetDto: CreateAssetDto) {
    return this.assetsService.createAsset(createAssetDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Retrieve all assets for the current user', type: Asset, isArray: true })
  getAssets(@Req() req: Request, @Query() query: PaginationQueryDto) {
    return this.assetsService.getAssets(req.user.id, query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Retrieve a single asset', type: Asset })
  getAssetById(@Param('id') id: string, @Req() req: Request) {
    return this.assetsService.getAssetById(id, req.user.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Update an asset', type: Asset })
  updateAsset(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
    return this.assetsService.updateAsset(id, updateAssetDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Remove an asset' })
  deleteAsset(@Param('id') id: string) {
    return this.assetsService.deleteAsset(id);
  }
}
