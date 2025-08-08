import { InMemoryUsersRepository } from 'test/repositories/users/in-memory-users-repository'
import { makeUser } from 'test/factories/users/make-user'
import { UniqueEntityID } from '@/domain/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error'
import { FakeHashGenerator } from 'test/cryptography/fake-hash-generator'
import { ChangePasswordUseCase } from './change-password'

describe('Change User Password - Unit', () => {
  let usersRepository: InMemoryUsersRepository
  let hashGenerator: FakeHashGenerator
  let sut: ChangePasswordUseCase

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    hashGenerator = new FakeHashGenerator()
    sut = new ChangePasswordUseCase(usersRepository, hashGenerator)

    const user = makeUser(
      { passwordHash: await hashGenerator.hash('123456') },
      new UniqueEntityID('123456'),
    )
    usersRepository.items.push(user)
  })

  it('should be able to change the user password', async () => {
    const result = await sut.execute({
      userId: '123456',
      password: '654321',
    })

    expect(result.isRight()).toBe(true)
    expect(usersRepository.items[0].passwordHash).toEqual('654321-hashed')
  })

  it('should not change the password of invalid user', async () => {
    const result = await sut.execute({
      userId: 'invalid-id',
      password: '',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
