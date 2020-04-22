import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { ConfigService } from '@nestjs/config'
import * as firebaseAdmin from 'firebase-admin'
import { generateFirebaseDefaultToken } from './util'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let customToken: string

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    customToken = await firebaseAdmin.auth().createCustomToken('uid')
    // const configService = app.get(ConfigService)
    // const backendAppPort = configService.get('BACKEND_APP_PORT')
    const firebaseWebAPIKey = 'AIzaSyBbg2NNhLmY8YRSFmjibDoDM7O1EgheNEI'

    await generateFirebaseDefaultToken(customToken, firebaseWebAPIKey)
  })

  it('/auth/login (POST) - No Auth bearer', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .expect(401)
      .expect((response) => {
        expect(response.body.error).toEqual('Unauthorized')
        expect(response.body.message).toEqual('No bearer token found in the header')
      })
  })

  it('/auth/login (POST) - Invalid Auth bearer', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .set('Authorization', 'Bearer RANDOM_STRING')
      .expect(401)
      .expect((response) => {
        expect(response.body.error).toEqual('Unauthorized')
        expect(response.body.message).toContain('Decoding Firebase ID token failed')
      })
  })

  it('/auth/login (POST) - CustomToken Auth bearer', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .set('Authorization', `Bearer ${customToken}`)
      .expect(401)
      .expect((response) => {
        expect(response.body.error).toEqual('Unauthorized')
        expect(response.body.message).toContain('expects an ID token, but was given a custom token')
      })
  })
})
