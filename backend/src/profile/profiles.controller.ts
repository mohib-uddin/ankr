import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, Put, Req } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CompleteInvestorProfileDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { SwaggerApiResponse } from '@decorators';
import { User } from '@entities';

@ApiTags('Profile')
@Controller('profile')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post('investor/onboard')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Save the entire investor onboarding data in one call', type: User })
  onboardInvestor(@Body() completeInvestorProfileDto: CompleteInvestorProfileDto) {
    return this.profilesService.onboardInvestor(completeInvestorProfileDto);
  }

  @Put('investor')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Update the entire investor profile with a single JSON payload', type: User })
  updateOnboardInvestor(@Body() completeInvestorProfileDto: CompleteInvestorProfileDto) {
    return this.profilesService.updateInvestorProfile(completeInvestorProfileDto);
  }

}
