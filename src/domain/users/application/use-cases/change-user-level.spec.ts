import { InMemoryUsersRepository } from 'test/repositories/users/in-memory-users-repository'
import { makeUser } from 'test/factories/users/make-user'
import { UniqueEntityID } from '@/domain/core/entities/unique-entity-id'
import { ChangeUserLevelUseCase } from './change-user-level'

describe('Change User Level - Unit', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: ChangeUserLevelUseCase

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new ChangeUserLevelUseCase(usersRepository)

    const user = makeUser({}, new UniqueEntityID('123456'))
    usersRepository.items.push(user)
  })

  it('should be able to change the user password', async () => {
    const result = await sut.execute({
      userId: '123456',
      level: 'ADMIN',
    })

    expect(result.isRight()).toBe(true)
    expect(usersRepository.items[0].level).toEqual('ADMIN')
  })
})
