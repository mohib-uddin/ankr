import { Controller, Get, Post, Body, Patch, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto, UpdateProfileDto, CreateInvestorProfileDto, CompleteInvestorProfileDto } from './dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Profile')
@Controller('profile')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post('complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Save the entire investor onboarding data in one call' })
  createFullInvestorProfile(@Body() completeInvestorProfileDto: CompleteInvestorProfileDto) {
    return this.profilesService.createFullInvestorProfile(completeInvestorProfileDto);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a new basic common profile' })
  createProfile(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.createProfile(createProfileDto);
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve full common profile (and all related steps) for a user' })
  getProfileByUserId(@Param('userId') userId: string) {
    return this.profilesService.getProfileByUserId(userId);
  }

  @Patch('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a common profile' })
  updateProfile(@Param('userId') userId: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profilesService.updateProfile(userId, updateProfileDto);
  }

  // --- Investor Profile Specific Extension ---
  @Post(':profileId/investor')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Attach investor-specific details to a common profile' })
  createInvestorProfile(@Param('profileId') profileId: string, @Body() data: CreateInvestorProfileDto) {
    return this.profilesService.createInvestorProfile(profileId, data);
  }
}
