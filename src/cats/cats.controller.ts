import { Controller, Post, Body, Get, Query } from '@nestjs/common'
import { CreateCatDto } from './dto/create-cat.dto'
import { CatsService } from './cats.service'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  @ApiOperation({ summary: 'Create cat' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get cat' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async get(@Query('name') name: string) {
    return this.catsService.findOne(name)
  }
}
