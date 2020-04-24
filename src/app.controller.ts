import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { AppLogger } from './shared/logger/logger.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private appLogger: AppLogger) {
    this.appLogger.setContext(AppController.name)
  }

  @Get()
  getHello(): string {
    this.appLogger.debug('Logged from getHello controller function')

    return this.appService.getHello()
  }
}
