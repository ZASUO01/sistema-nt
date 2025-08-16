import { InMemoryUsersRepository } from '@/test/repositories/users/in-memory-users-repository'
import { EditUserUseCase } from './edit-user'
import { User } from '../../enterprise/entities/user'
import { makeUser } from '@/test/factories/users/make-user'
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error'

describe('(UNIT) Edit User', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: EditUserUseCase

  let user: User

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new EditUserUseCase(usersRepository)

    user = makeUser()
    await usersRepository.create(user)
  })

  it('should be able to edit an user', async () => {
    const result = await sut.execute({
      userId: user.id.toString(),
      firstName: 'firstname-edit',
      lastName: 'lastname-edit',
      nick: 'nick-edit',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: usersRepository.items[0],
    })
    expect(usersRepository.items[0]).toMatchObject({
      props: expect.objectContaining({
        firstName: 'firstname-edit',
        lastName: 'lastname-edit',
        nick: 'nick-edit',
      }),
    })
  })

  it('should not be able to edit an invalid user', async () => {
    const result = await sut.execute({
      userId: 'invalid-id',
      firstName: 'firstname-edit',
      lastName: 'lastname-edit',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
