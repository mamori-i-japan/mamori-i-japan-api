import { Test, TestingModule } from '@nestjs/testing'
import { CatsService } from './cats.service'
import { CatsRepository } from './cats.repository'

describe('CatsService', () => {
  let service: CatsService
  const catsRepository = { findAll: () => ['test'] }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatsService, CatsRepository],
    })
      .overrideProvider(CatsRepository)
      .useValue(catsRepository)
      .compile()

    service = module.get<CatsService>(CatsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
