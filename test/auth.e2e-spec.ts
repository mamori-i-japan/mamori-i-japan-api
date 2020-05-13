import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { ConfigService } from '@nestjs/config'
import * as firebaseAdmin from 'firebase-admin'
import { generateFirebaseDefaultToken } from './util'

describe('AuthController (e2e)', () => {
  let app: INestApplication
  let customToken: string
  let firebaseDefaultToken: string

  beforeAll(async (done) => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    const configService = app.get(ConfigService)
    const firebaseWebAPIKey = configService.get('FIREBASE_WEB_API_KEY')
    console.log('firebaseWebAPIKey : ', firebaseWebAPIKey)
    customToken = await firebaseAdmin.auth().createCustomToken('RANDOM_UID_FOR_TEST', {
      // eslint-disable-next-line @typescript-eslint/camelcase
      provider_id: 'anonymous',
    })

    firebaseDefaultToken = await generateFirebaseDefaultToken(customToken, firebaseWebAPIKey)
    console.log('firebaseDefaultToken : ', firebaseDefaultToken)

    done()
  })

  it('/auth/login (POST) - No Auth bearer', (done) => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .expect(401)
      .expect((response) => {
        expect(response.body.error).toEqual('Unauthorized')
        expect(response.body.message).toEqual('No bearer token found in the header')
      })
      .end(() => done())
  })

  it('/auth/login (POST) - Invalid Auth bearer', (done) => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .set('Authorization', 'Bearer RANDOM_STRING')
      .expect(401)
      .expect((response) => {
        expect(response.body.error).toEqual('Unauthorized')
        expect(response.body.message).toContain('Decoding Firebase ID token failed')
      })
      .end(() => done())
  })

  it('/auth/login (POST) - CustomToken Auth bearer', (done) => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .set('Authorization', `Bearer ${customToken}`)
      .expect(401)
      .expect((response) => {
        expect(response.body.error).toEqual('Unauthorized')
        expect(response.body.message).toContain('expects an ID token, but was given a custom token')
      })
      .end(() => done())
  })

  it('/auth/login (POST) - FDT Auth bearer without prefecture', (done) => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .set('Authorization', `Bearer ${firebaseDefaultToken}`)
      .expect(400)
      .expect((response) => {
        expect(response.body.error).toEqual('Bad Request')
        expect(response.body.message).toBeInstanceOf(Array)
        expect(response.body.message).toContain('prefecture must be an integer number')
      })
      .end(() => done())
  })

  it('/auth/login (POST) - FDT Auth bearer with invalid prefecture', (done) => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .set('Authorization', `Bearer ${firebaseDefaultToken}`)
      .send({
        prefecture: 'random_value',
      })
      .expect(400)
      .expect((response) => {
        expect(response.body.error).toEqual('Bad Request')
        expect(response.body.message).toBeInstanceOf(Array)
        expect(response.body.message).toContain('prefecture must be an integer number')
      })
      .end(() => done())
  })

  it('/auth/login (POST) - FDT Auth bearer with invalid prefecture', (done) => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .set('Authorization', `Bearer ${firebaseDefaultToken}`)
      .send({
        prefecture: 100,
      })
      .expect(400)
      .expect((response) => {
        expect(response.body.error).toEqual('Bad Request')
        expect(response.body.message).toBeInstanceOf(Array)
        expect(response.body.message).toContain('prefecture must not be greater than 47')
      })
      .end(() => done())
  })

  it('/auth/login (POST) - FDT Auth bearer with valid prefecture', (done) => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .set('Authorization', `Bearer ${firebaseDefaultToken}`)
      .send({
        prefecture: 1,
      })
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({})
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toMatchObject({})
      })
      .end(() => done())
  })

  afterAll(async (done) => {
    await firebaseAdmin.app().delete()
    await app.close()
    done()
  })
})
