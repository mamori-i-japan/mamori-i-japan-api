import { Test, TestingModule } from '@nestjs/testing'
import { OrganizationsService } from './organizations.service'
import { OrganizationsRepository } from './organizations.repository'

describe('OrganizationsService', () => {
  let service: OrganizationsService
  const organizationsRepository = { findAll: () => ['test'] }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationsService, OrganizationsRepository],
    })
      .overrideProvider(OrganizationsRepository)
      .useValue(organizationsRepository)
      .compile()

    service = module.get<OrganizationsService>(OrganizationsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
