import { Test, TestingModule } from '@nestjs/testing'
import { AdminsService } from './admins.service'
import { AdminsRepository } from './admins.repository'
import { OrganizationsService } from '../organizations/organizations.service'
import { PrefecturesService } from '../prefectures/prefectures.service'

describe('AdminsService', () => {
  let service: AdminsService
  const adminsRepository = { findAll: () => ['test'] }
  const organizationsService = {}
  const prefecturesService = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminsService, AdminsRepository, OrganizationsService, PrefecturesService],
    })
      .overrideProvider(AdminsRepository)
      .useValue(adminsRepository)
      .overrideProvider(OrganizationsService)
      .useValue(organizationsService)
      .overrideProvider(PrefecturesService)
      .useValue(prefecturesService)
      .compile()

    service = module.get<AdminsService>(AdminsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
