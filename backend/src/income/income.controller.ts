import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Req, Query } from '@nestjs/common';
import { IncomeService } from './income.service';
import { CreateIncomeDto, UpdateIncomeDto, PaginationQueryDto } from '@dtos';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerApiResponse } from '@decorators';
import { Income } from '@entities';
import { Request } from 'express';

@ApiTags('Income')
@Controller('income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Create a new income entry (linked to common profile)', type: Income })
  createIncome(@Body() createIncomeDto: CreateIncomeDto) {
    return this.incomeService.createIncome(createIncomeDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Retrieve all income records for the current user', type: Income, isArray: true })
  getIncomes(@Req() req: Request, @Query() query: PaginationQueryDto) {
    return this.incomeService.getIncomes(req.user.id, query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Retrieve a single income record', type: Income })
  getIncomeById(@Param('id') id: string, @Req() req: Request) {
    return this.incomeService.getIncomeById(id, req.user.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Update an income record', type: Income })
  updateIncome(@Param('id') id: string, @Body() updateIncomeDto: UpdateIncomeDto) {
    return this.incomeService.updateIncome(id, updateIncomeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Remove an income record' })
  deleteIncome(@Param('id') id: string) {
    return this.incomeService.deleteIncome(id);
  }
}
