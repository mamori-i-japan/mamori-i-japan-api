import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersRepository } from './users.repository'
import { FirebaseModule } from '../firebase/firebase.module'

@Module({
  imports: [FirebaseModule],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
