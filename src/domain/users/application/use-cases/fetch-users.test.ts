import { InMemoryUsersRepository } from '@/test/repositories/users/in-memory-users-repository'
import { FetchUsersUseCase } from './fetch-users'
import { makeUser } from '@/test/factories/users/make-user'

describe('(UNIT) Fetch Users', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: FetchUsersUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new FetchUsersUseCase(usersRepository)
  })

  it('should be able to fetch all the users', async () => {
    for (let i = 0; i < 10; i++) {
      await usersRepository.create(makeUser())
    }

    const result = await sut.execute({})

    expect(result.isRight()).toBe(true)
    expect(result.value?.users).toHaveLength(10)
  })

  it('should be able to fetch paginated users', async () => {
    for (let i = 0; i < 12; i++) {
      await usersRepository.create(makeUser())
    }

    const result = await sut.execute({ page: 2, take: 10 })

    expect(result.isRight()).toBe(true)
    expect(result.value?.users).toHaveLength(2)
  })
})
