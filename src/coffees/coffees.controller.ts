import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger'
import { ParseIntPipe } from './../common/pipes/parse-int.pipe';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { CoffeesService } from './coffees.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { REQUEST } from '@nestjs/core'
import { Request }from 'express'
import { Public } from '../common/decorators/public.decorator';
import { Protocol } from '../common/decorators/protocol.decorator';

@ApiTags('coffees')
@Controller('coffees')
export class CoffeesController {
  constructor(
      private readonly coffeesService: CoffeesService, 
      @Inject(REQUEST) private readonly request: Request
    ) { 
  }

  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @UsePipes(ValidationPipe)
  @Get()
  async findAll(@Protocol('https') protocol: string, @Query() paginationQuery: PaginationQueryDto){
    console.log(protocol)
    // await new Promise(resolve => setTimeout(resolve, 5000))
    return this.coffeesService.findAll(paginationQuery)
  }
  
  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string){
    return this.coffeesService.findOne(id)
  }

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto)
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: string, @Body(ValidationPipe) updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, updateCoffeeDto)
  }
  
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.coffeesService.remove(id)
  }
}
