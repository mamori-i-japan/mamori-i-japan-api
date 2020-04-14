import { Module } from '@nestjs/common'
import { CatsController } from './cats.controller'
import { CatsService } from './cats.service'
import { CatsRepository } from './cats.repository'
import { FirebaseModule } from '../firebase/firebase.module'

@Module({
  imports: [FirebaseModule],
  controllers: [CatsController],
  providers: [CatsService, CatsRepository],
})
export class CatsModule {}
