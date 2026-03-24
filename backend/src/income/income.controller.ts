import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { IncomeService } from './income.service';
import { CreateIncomeDto, UpdateIncomeDto } from '@dtos';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Income')
@Controller('income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a new income entry (linked to common profile)' })
  createIncome(@Body() createIncomeDto: CreateIncomeDto) {
    return this.incomeService.createIncome(createIncomeDto);
  }

  @Get('profile/:profileId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all income records for a specific common profile' })
  getIncomesByProfileId(@Param('profileId') profileId: string) {
    return this.incomeService.getIncomesByProfileId(profileId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a single income record' })
  getIncomeById(@Param('id') id: string) {
    return this.incomeService.getIncomeById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an income record' })
  updateIncome(@Param('id') id: string, @Body() updateIncomeDto: UpdateIncomeDto) {
    return this.incomeService.updateIncome(id, updateIncomeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove an income record' })
  deleteIncome(@Param('id') id: string) {
    return this.incomeService.deleteIncome(id);
  }
}
