import { Test, TestingModule } from '@nestjs/testing'
import { AdminsService } from './admins.service'
import { AdminsRepository } from './admins.repository'

describe('AdminsService', () => {
  let service: AdminsService
  const adminsRepository = { findAll: () => ['test'] }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminsService, AdminsRepository],
    })
      .overrideProvider(AdminsRepository)
      .useValue(adminsRepository)
      .compile()

    service = module.get<AdminsService>(AdminsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
