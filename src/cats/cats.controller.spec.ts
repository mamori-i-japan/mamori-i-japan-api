import { Test, TestingModule } from '@nestjs/testing'
import { CatsController } from './cats.controller'
import { CatsService } from './cats.service'

describe('Cats Controller', () => {
  let controller: CatsController
  const catsService = { findAll: () => ['test'] }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [CatsController],
      providers: [CatsService],
    })
      .overrideProvider(CatsService)
      .useValue(catsService)
      .compile()

    controller = module.get<CatsController>(CatsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
