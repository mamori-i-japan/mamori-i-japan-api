import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersRepository } from './users.repository'
import { FirebaseModule } from '../firebase/firebase.module'
import { UsersController } from './users.controller'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [FirebaseModule, ConfigModule],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
