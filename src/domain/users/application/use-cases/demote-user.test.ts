import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error'
import { DemoteUserUseCase } from './demote-user'
import { InMemoryUsersRepository } from '@/test/repositories/users/in-memory-users-repository'
import { User } from '../../enterprise/entities/user'
import { makeUser } from '@/test/factories/users/make-user'

describe('(UNIT) Demote User', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: DemoteUserUseCase
  let user: User

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new DemoteUserUseCase(usersRepository)

    user = makeUser()
    await usersRepository.create(user)
  })

  it('should be able to demote an user level', async () => {
    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(usersRepository.items[0].isAdmin()).toBe(false)
  })

  it('should not be able to demote an invalid user', async () => {
    const result = await sut.execute({
      userId: 'invalid-user',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
