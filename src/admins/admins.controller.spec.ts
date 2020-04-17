import { Test, TestingModule } from '@nestjs/testing'
import { AdminsController } from './admins.controller'
import { AdminsService } from './admins.service'

describe('Admins Controller', () => {
  let controller: AdminsController
  const adminsService = { findAll: () => ['test'] }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminsController],
      providers: [AdminsService],
    })
      .overrideProvider(AdminsService)
      .useValue(adminsService)
      .compile()

    controller = module.get<AdminsController>(AdminsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
