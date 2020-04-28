import { Module } from '@nestjs/common'
import { OrganizationsService } from './organizations.service'
import { OrganizationsRepository } from './organizations.repository'
import { SharedModule } from '../shared/shared.module'
import { OrganizationsController } from './organizations.controller'

@Module({
  imports: [SharedModule],
  providers: [OrganizationsService, OrganizationsRepository],
  exports: [OrganizationsService],
  controllers: [OrganizationsController],
})
export class OrganizationsModule {}
