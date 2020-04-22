import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppService } from './app.service'

describe('AppController', () => {
  let appController: AppController
  const appService = {}

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    })
      .overrideProvider(AppService)
      .useValue(appService)
      .compile()

    appController = app.get<AppController>(AppController)
  })

  it('should be defined', () => {
    expect(appController).toBeDefined()
  })
})
