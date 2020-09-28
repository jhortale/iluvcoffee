import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { REQUEST } from '@nestjs/core'
import { Request }from 'express'

@Controller('coffees')
export class CoffeesController {
  constructor(
      private readonly coffeesService: CoffeesService, 
      @Inject(REQUEST) private readonly request: Request
    ) {
    console.log('CoffeesController created')
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto){
    // const { limit, offset} = paginationQuery
    return this.coffeesService.findAll(paginationQuery)
  }
  
  @Get(':id')
  findOne(@Param('id') id: string){
    return this.coffeesService.findOne(id)
  }

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, updateCoffeeDto)
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeesService.remove(id)
  }
}
