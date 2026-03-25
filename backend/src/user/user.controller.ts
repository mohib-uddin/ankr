import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { SwaggerApiResponse } from '@decorators';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiMessageData } from '@types';
import { User } from '@entities';

@ApiTags('User')
@ApiBearerAuth('JWT-auth')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Get current user', type: User })
  async getCurrentUser(@Req() req: Request): Promise<ApiMessageData> {
    return await this.userService.getUser(req.user.id);
  }

}
