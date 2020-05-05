import { Test, TestingModule } from '@nestjs/testing'
import { PrefecturesController } from './prefectures.controller'
import { PrefecturesService } from './prefectures.service'

describe('Admins Controller', () => {
  let controller: PrefecturesController
  const prefecturesService = { findAll: () => ['test'] }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrefecturesController],
      providers: [PrefecturesService],
    })
      .overrideProvider(PrefecturesService)
      .useValue(prefecturesService)
      .compile()

    controller = module.get<PrefecturesController>(PrefecturesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
