import { Controller, Get, HttpCode, HttpStatus, Query, Req, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { SwaggerApiResponse } from '@decorators';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateApiKeyDto, GetApiKeyDto, UpdateApiKeyDto } from '@dtos';
import { ApiMessage, ApiMessageData } from '@types';

@ApiTags('User')
@ApiBearerAuth('JWT-auth')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse('Get current user')
  async getCurrentUser(@Req() req: Request): Promise<ApiMessageData> {
    return await this.userService.getUser(req.user.id);
  }

}
