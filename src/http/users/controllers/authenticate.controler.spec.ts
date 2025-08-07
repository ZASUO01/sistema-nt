import { AppModule } from '@/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { UserFactory } from 'test/factories/users/make-user'

describe('Authenticate E2E', () => {
  const apiPath = '/users'
  let app: INestApplication
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    await app.init()
    userFactory = moduleRef.get(UserFactory)
  })

  test('[POST] /users/login', async () => {
    await userFactory.makePrismaUser({
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 8),
    })

    const response = await request(app.getHttpServer())
      .post(apiPath.concat('/login'))
      .send({
        email: 'johndoe@example.com',
        password: '123456',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refresh_token='),
    ])
  })
})
