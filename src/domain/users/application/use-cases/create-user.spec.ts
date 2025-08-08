import { InMemoryUsersRepository } from 'test/repositories/users/in-memory-users-repository'
import { CreateUserUseCase } from './create-user'
import { FakeHashGenerator } from 'test/cryptography/fake-hash-generator'
import { makeUser } from 'test/factories/users/make-user'
import { faker } from '@faker-js/faker'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

describe('Create User - Unit', () => {
  let usersRepository: InMemoryUsersRepository
  let hashGenerator: FakeHashGenerator
  let sut: CreateUserUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    hashGenerator = new FakeHashGenerator()
    sut = new CreateUserUseCase(usersRepository, hashGenerator)
  })

  it('should be able to create a new user', async () => {
    const result = await sut.execute({
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: faker.internet.password(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: usersRepository.items[0],
    })
  })

  it('should not be able to create user with duplicated email', async () => {
    const user = makeUser({
      email: 'jonhdoe@example.com',
    })
    usersRepository.items.push(user)

    const result = await sut.execute({
      email: 'jonhdoe@example.com',
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: faker.internet.password(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should hash user password', async () => {
    await sut.execute({
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: '123456',
    })

    const hashedPassword = await hashGenerator.hash('123456')

    expect(usersRepository.items[0].passwordHash).toEqual(hashedPassword)
  })
})
