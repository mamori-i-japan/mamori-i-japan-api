import { Controller, Post, Body } from '@nestjs/common'
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
    this.catsService.create(createCatDto)
  }
}
