import { InMemoryUsersRepository } from 'test/repositories/users/in-memory-users-repository'
import { FakeTokenGenerator } from '../../../../../test/cryptography/fake-token-generator'
import { BlockeUserError } from '../errors/blocked-user-error'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { AuthenticateUserUseCase } from './authenticate-user'
import { FakeHashComparer } from 'test/cryptography/fake-hash-comparer'
import { FakeHashGenerator } from 'test/cryptography/fake-hash-generator'
import { makeUser } from 'test/factories/users/make-user'

describe('Authenticate Unit', () => {
  let usersRepository: InMemoryUsersRepository
  let hashComparer: FakeHashComparer
  let hashGenerator: FakeHashGenerator
  let tokenGenerator: FakeTokenGenerator
  let sut: AuthenticateUserUseCase

  beforeAll(async () => {
    usersRepository = new InMemoryUsersRepository()
    hashComparer = new FakeHashComparer()
    tokenGenerator = new FakeTokenGenerator()
    sut = new AuthenticateUserUseCase(
      usersRepository,
      hashComparer,
      tokenGenerator,
    )

    hashGenerator = new FakeHashGenerator()

    const user = makeUser({
      email: 'johndoe@example.com',
      password_hash: await hashGenerator.hash('123456'),
    })
    usersRepository.items.push(user)
  })

  it('should be able to authenticate an user', async () => {
    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.stringContaining('ACCESS'),
      refreshToken: expect.stringContaining('REFRESH'),
    })
  })

  it('should not be able to authenticate with invalid email', async () => {
    const result = await sut.execute({
      email: 'invalid-email',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with invalid password', async () => {
    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: 'invalid-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with blocked user', async () => {
    const blockedUser = makeUser({
      email: 'blocked@example.com',
      password_hash: await hashGenerator.hash('123456'),
      status: 'BLOCKED',
    })
    usersRepository.items.push(blockedUser)

    const result = await sut.execute({
      email: 'blocked@example.com',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(BlockeUserError)
  })
})
