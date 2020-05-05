import { Test, TestingModule } from '@nestjs/testing'
import { PrefecturesService } from './prefectures.service'
import { PrefecturesRepository } from './prefectures.repository'

describe('PrefecturesService', () => {
  let service: PrefecturesService
  const prefecturesRepository = { findAll: () => ['test'] }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrefecturesService, PrefecturesRepository],
    })
      .overrideProvider(PrefecturesRepository)
      .useValue(prefecturesRepository)
      .compile()

    service = module.get<PrefecturesService>(PrefecturesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
