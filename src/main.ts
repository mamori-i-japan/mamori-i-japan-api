import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { AppLogger } from './shared/logger/logger.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: true,
  })

  app.useLogger(new AppLogger())

  const configService = app.get(ConfigService)
  const backendAppPort = configService.get('BACKEND_APP_PORT')

  const options = new DocumentBuilder()
    .setTitle('contact-tracing-api')
    .setDescription('SwaggerUI for contact-tracing-api API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('swagger', app, document)

  await app.listen(backendAppPort)
}
bootstrap()
