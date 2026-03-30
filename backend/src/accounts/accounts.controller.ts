import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Req, Query } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto, UpdateAccountDto, PaginationQueryDto } from '@dtos';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerApiResponse } from '@decorators';
import { Account } from '@entities';
import { Request } from 'express';

@ApiTags('Accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Create a new account (linked to common profile)', type: Account })
  createAccount(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.createAccount(createAccountDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Retrieve all accounts for the current user', type: Account, isArray: true })
  getAccounts(@Req() req: Request, @Query() query: PaginationQueryDto) {
    return this.accountsService.getAccounts(req.user.id, query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Retrieve a single account', type: Account })
  getAccountById(@Param('id') id: string, @Req() req: Request) {
    return this.accountsService.getAccountById(id, req.user.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Update an account', type: Account })
  updateAccount(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountsService.updateAccount(id, updateAccountDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Remove an account' })
  deleteAccount(@Param('id') id: string) {
    return this.accountsService.deleteAccount(id);
  }
}
