import { FakeHashComparer } from '@/test/cryptography/fake-hash-comparer'
import { FakeHashGenerator } from '@/test/cryptography/fake-hash-generator'
import { InMemoryUsersRepository } from '@/test/repositories/users/in-memory-users-repository'
import { ChangePasswordUseCase } from './change-password'
import { User } from '../../enterprise/entities/user'
import { makeUser } from '@/test/factories/users/make-user'
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

describe('(UNIT) Change Password', () => {
  let usersRepository: InMemoryUsersRepository
  let hashComparer: FakeHashComparer
  let hashGenerator: FakeHashGenerator
  let sut: ChangePasswordUseCase
  let user: User

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    hashComparer = new FakeHashComparer()
    hashGenerator = new FakeHashGenerator()
    sut = new ChangePasswordUseCase(
      usersRepository,
      hashComparer,
      hashGenerator,
    )

    user = makeUser({
      passwordHash: await hashGenerator.hash('123456'),
    })
    await usersRepository.create(user)
  })

  it('should be able to change the user password', async () => {
    const result = await sut.execute({
      userId: user.id.toString(),
      oldPassword: '123456',
      password: '654321',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeNull()
    expect(usersRepository.items[0]).toMatchObject({
      props: expect.objectContaining({ passwordHash: '654321-hashed' }),
    })
  })

  it('should not be able to change the password of an invalid user', async () => {
    const result = await sut.execute({
      userId: 'invalid-id',
      oldPassword: '123456',
      password: '654321',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to change the user password using an invalid old password', async () => {
    const result = await sut.execute({
      userId: user.id.toString(),
      oldPassword: '11111',
      password: '654321',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})
