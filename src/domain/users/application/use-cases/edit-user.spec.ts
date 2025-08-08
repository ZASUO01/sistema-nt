import { InMemoryUsersRepository } from 'test/repositories/users/in-memory-users-repository'
import { EditUserUseCase } from './edit-user'
import { makeUser } from 'test/factories/users/make-user'
import { UniqueEntityID } from '@/domain/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error'

describe('Edit User - Unit', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: EditUserUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new EditUserUseCase(usersRepository)

    const user = makeUser({}, new UniqueEntityID('123456'))
    usersRepository.items.push(user)
  })

  it('should be able to update an user', async () => {
    const result = await sut.execute({
      userId: '123456',
      firstName: 'altered',
      lastName: 'name',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: expect.objectContaining({
        firstName: 'altered',
        lastName: 'name',
      }),
    })
  })

  it('should not update invalid user', async () => {
    const result = await sut.execute({
      userId: 'invalid-id',
      firstName: '',
      lastName: '',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
