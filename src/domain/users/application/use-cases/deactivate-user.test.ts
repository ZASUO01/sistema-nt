import { InMemoryUsersRepository } from '@/test/repositories/users/in-memory-users-repository'
import { DeactivateUserUseCase } from './deactivate-user'
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error'
import { User } from '../../enterprise/entities/user'
import { makeUser } from '@/test/factories/users/make-user'

describe('(UNIT) Deactivate User', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: DeactivateUserUseCase
  let user: User

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new DeactivateUserUseCase(usersRepository)

    user = makeUser()
    await usersRepository.create(user)
  })

  it('should be able to deactivate an user', async () => {
    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(usersRepository.items[0].isInactive()).toBe(true)
  })

  it('should not be able to deactivate an invalid user', async () => {
    const result = await sut.execute({
      userId: 'invalid-user',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
