import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersRepository } from './users.repository'
import { SharedModule } from '../shared/shared.module'
import { UsersController } from './users.controller'
import { OrganizationsModule } from '../organizations/organizations.module'

@Module({
  imports: [SharedModule, OrganizationsModule],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
