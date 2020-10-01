import { ParseIntPipe } from './../common/pipes/parse-int.pipe';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { REQUEST } from '@nestjs/core'
import { Request }from 'express'
import { Public } from 'src/common/decorators/public.decorator';
import { Protocol } from 'src/common/decorators/protocol.decorator';

@Controller('coffees')
export class CoffeesController {
  constructor(
      private readonly coffeesService: CoffeesService, 
      @Inject(REQUEST) private readonly request: Request
    ) { 
  }

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
