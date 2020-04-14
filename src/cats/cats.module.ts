import { Module } from '@nestjs/common'
import { CatsController } from './cats.controller'
import { CatsService } from './cats.service'
import { CatsRepository } from './cats.repository'

@Module({
  controllers: [CatsController],
  providers: [CatsService, CatsRepository],
})
export class CatsModule {}
