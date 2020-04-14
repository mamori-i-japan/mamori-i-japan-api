import { APIGatewayProxyHandler } from 'aws-lambda'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Server } from 'http'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ExpressAdapter } from '@nestjs/platform-express'
import { createServer, proxy } from 'aws-serverless-express'
import { eventContext } from 'aws-serverless-express/middleware'
import { ConfigService } from '@nestjs/config'
import * as express from 'express'
import * as firebaseAdmin from 'firebase-admin'
const serviceAccount = require('../serviceAccountKey.json')

let cachedServer: Server

const bootstrapServer = async (): Promise<Server> => {
  const expressApp = express()
  const adapter = new ExpressAdapter(expressApp)

  const app = await NestFactory.create(AppModule, adapter)
  app.use(eventContext())
  app.enableCors()

  const configService = app.get(ConfigService)
  const firebaseDatabaseURL = configService.get('FIREBASE_DATABASE_URL')

  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: firebaseDatabaseURL,
  })

  const options = new DocumentBuilder()
    .setTitle('contact-tracing-api')
    .setDescription('SwaggerUI for contact-tracing-api API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('swagger', app, document)

  await app.init()
  return createServer(expressApp)
}

export const handler: APIGatewayProxyHandler = async (event, context) => {
  if (!cachedServer) {
    const server = await bootstrapServer()
    cachedServer = server
    return proxy(server, event, context, 'PROMISE').promise
  } else {
    return proxy(cachedServer, event, context, 'PROMISE').promise
  }
}
