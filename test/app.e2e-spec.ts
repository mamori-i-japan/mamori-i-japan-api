import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import * as firebaseAdmin from 'firebase-admin'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeAll(async (done) => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    done()
  })

  it('/ (GET)', (done) => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!')
      .end(() => done())
  })

  afterAll(async (done) => {
    await firebaseAdmin.app().delete()
    await app.close()
    done()
  })
})
