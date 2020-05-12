import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { AppLogger } from './shared/logger/logger.service'

exports.handler = async () => {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  })
  app.useLogger(new AppLogger())

  await app.init()

  return
}
