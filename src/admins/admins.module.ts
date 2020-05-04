import { Module } from '@nestjs/common'
import { AdminsService } from './admins.service'
import { AdminsRepository } from './admins.repository'
import { SharedModule } from '../shared/shared.module'
import { AdminsController } from './admins.controller'
import { OrganizationsModule } from '../organizations/organizations.module'

@Module({
  imports: [SharedModule, OrganizationsModule],
  providers: [AdminsService, AdminsRepository],
  exports: [AdminsService],
  controllers: [AdminsController],
})
export class AdminsModule {}
