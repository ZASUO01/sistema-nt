import { InMemoryUsersRepository } from 'test/repositories/users/in-memory-users-repository'
import { DeleteUserUserCase } from './delete-user'
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error'
import { makeUser } from 'test/factories/users/make-user'
import { UniqueEntityID } from '@/domain/core/entities/unique-entity-id'

describe('Delete User - Unit', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: DeleteUserUserCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new DeleteUserUserCase(usersRepository)

    const user = makeUser({}, new UniqueEntityID('123456'))
    usersRepository.items.push(user)
  })

  it('should be able to delete an user', async () => {
    const result = await sut.execute({ userId: '123456' })

    expect(result.isRight()).toBe(true)
    expect(usersRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an inexistent user', async () => {
    const result = await sut.execute({ userId: 'inexistent-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
