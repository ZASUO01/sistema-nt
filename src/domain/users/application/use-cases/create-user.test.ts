import { FakeHashGenerator } from '@/test/cryptography/fake-hash-generator'
import { InMemoryUsersRepository } from '@/test/repositories/users/in-memory-users-repository'
import { CreateUserUseCase } from './create-user'
import { faker } from '@faker-js/faker'
import { makeUser } from '@/test/factories/users/make-user'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

describe('(UNIT) Create User', () => {
  let usersRepository: InMemoryUsersRepository
  let hashGenerator: FakeHashGenerator
  let sut: CreateUserUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    hashGenerator = new FakeHashGenerator()
    sut = new CreateUserUseCase(usersRepository, hashGenerator)
  })

  it('should be able to create an user', async () => {
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

  it('should hash the user password while creating', async () => {
    const result = await sut.execute({
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(usersRepository.items[0]).toMatchObject({
      props: expect.objectContaining({
        passwordHash: '123456-hashed',
      }),
    })
  })

  it('should not be able to create an user with duplicated email', async () => {
    const user = makeUser({ email: 'jonhdoe@example.com' })
    await usersRepository.create(user)

    const result = await sut.execute({
      email: 'jonhdoe@example.com',
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: faker.internet.password(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })
})
