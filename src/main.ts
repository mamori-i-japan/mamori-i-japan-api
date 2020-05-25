import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { AppLogger } from './shared/logger/logger.service'
import { RequestIdMiddleware } from './shared/middleware/request-id.middleware'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  })

  app.useLogger(new AppLogger())
  app.use(RequestIdMiddleware)
  app.enableCors()

  const configService = app.get(ConfigService)
  const backendAppPort = configService.get('BACKEND_APP_PORT')

  const options = new DocumentBuilder()
    .setTitle('mamori-i-japan-api')
    .setDescription('Swagger UI for mamori-i-japan-api API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('swagger', app, document)

  await app.listen(backendAppPort)
}
bootstrap()
