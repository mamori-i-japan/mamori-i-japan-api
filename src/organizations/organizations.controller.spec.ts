import { Test, TestingModule } from '@nestjs/testing'
import { OrganizationsController } from './organizations.controller'
import { OrganizationsService } from './organizations.service'

describe('Admins Controller', () => {
  let controller: OrganizationsController
  const organizationsService = { findAll: () => ['test'] }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationsController],
      providers: [OrganizationsService],
    })
      .overrideProvider(OrganizationsService)
      .useValue(organizationsService)
      .compile()

    controller = module.get<OrganizationsController>(OrganizationsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
