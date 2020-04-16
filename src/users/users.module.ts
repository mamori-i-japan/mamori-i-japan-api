import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersRepository } from './users.repository'
import { FirebaseModule } from '../firebase/firebase.module'
import { UsersController } from './users.controller'

@Module({
  imports: [FirebaseModule],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
