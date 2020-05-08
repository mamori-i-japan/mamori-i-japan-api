import { Injectable } from '@nestjs/common'
import { AppLogger } from './shared/logger/logger.service'

@Injectable()
export class AppService {
  constructor(private appLogger: AppLogger) {
    this.appLogger.setContext(AppService.name)
  }

  getHello(): string {
    this.appLogger.log('Logged from getHello service function')

    return 'Hello World!'
  }
}
