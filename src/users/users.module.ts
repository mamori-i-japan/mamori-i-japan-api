import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersRepository } from './users.repository'
import { SharedModule } from '../shared/shared.module'
import { UsersController } from './users.controller'

@Module({
  imports: [SharedModule],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
