import { InMemoryUserAccessesRepository } from '@/test/repositories/users/in-memory-user-accesses-repository'
import { InMemoryUsersRepository } from '@/test/repositories/users/in-memory-users-repository'
import { ChangeUserAccessesUseCase } from './change-user-accesses'
import { User } from '../../enterprise/entities/user'
import { makeUser } from '@/test/factories/users/make-user'
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error'

describe('(UNIT) Change User Accesses', () => {
  let usersRepository: InMemoryUsersRepository
  let userAccessesRepository: InMemoryUserAccessesRepository
  let sut: ChangeUserAccessesUseCase
  let user: User

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    userAccessesRepository = new InMemoryUserAccessesRepository()
    sut = new ChangeUserAccessesUseCase(usersRepository, userAccessesRepository)

    user = makeUser()
    await usersRepository.create(user)
  })

  it('should be able to create initial user accesses', async () => {
    const result = await sut.execute({
      userId: user.id.toString(),
      userAccessDetails: [
        { appCode: 'FINANCE', appLevel: 'READ' },
        { appCode: 'FINANCE', appLevel: 'ADDCHANGE' },
        { appCode: 'FINANCE', appLevel: 'ADDCHANGE' },
        { appCode: 'STOREROOM', appLevel: 'READ' },
      ],
    })

    expect(result.isRight()).toBe(true)
    expect(userAccessesRepository.items).toHaveLength(3)
  })

  it('should not be able to change invalid user accesses', async () => {
    const result = await sut.execute({
      userId: 'invalid-user',
      userAccessDetails: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be able to remove user accesses', async () => {
    await sut.execute({
      userId: user.id.toString(),
      userAccessDetails: [
        { appCode: 'FINANCE', appLevel: 'READ' },
        { appCode: 'FINANCE', appLevel: 'ADDCHANGE' },
        { appCode: 'STOREROOM', appLevel: 'READ' },
      ],
    })

    let result = await sut.execute({
      userId: user.id.toString(),
      userAccessDetails: [
        { appCode: 'FINANCE', appLevel: 'READ' },
        { appCode: 'FINANCE', appLevel: 'READ' },
        { appCode: 'STOREROOM', appLevel: 'READ' },
      ],
    })

    expect(result.isRight()).toBe(true)
    expect(userAccessesRepository.items).toHaveLength(2)
    expect(userAccessesRepository.items).toEqual([
      expect.objectContaining({
        props: expect.objectContaining({
          appCode: 'FINANCE',
          appLevel: 'READ',
        }),
      }),
      expect.objectContaining({
        props: expect.objectContaining({
          appCode: 'STOREROOM',
          appLevel: 'READ',
        }),
      }),
    ])

    result = await sut.execute({
      userId: user.id.toString(),
      userAccessDetails: [],
    })

    expect(result.isRight()).toBe(true)
    expect(userAccessesRepository.items).toHaveLength(0)
  })

  it('should be able to add new user accesses', async () => {
    await sut.execute({
      userId: user.id.toString(),
      userAccessDetails: [
        { appCode: 'FINANCE', appLevel: 'READ' },
        { appCode: 'FINANCE', appLevel: 'ADDCHANGE' },
        { appCode: 'STOREROOM', appLevel: 'READ' },
      ],
    })

    const result = await sut.execute({
      userId: user.id.toString(),
      userAccessDetails: [
        { appCode: 'FINANCE', appLevel: 'READ' },
        { appCode: 'FINANCE', appLevel: 'ADDCHANGE' },
        { appCode: 'STOREROOM', appLevel: 'READ' },
        { appCode: 'FINANCE', appLevel: 'READ' },
        { appCode: 'FINANCE', appLevel: 'DELETE' },
      ],
    })

    expect(result.isRight()).toBe(true)
    expect(userAccessesRepository.items).toHaveLength(4)
    expect(userAccessesRepository.items).toEqual([
      expect.objectContaining({
        props: expect.objectContaining({
          appCode: 'FINANCE',
          appLevel: 'READ',
        }),
      }),
      expect.objectContaining({
        props: expect.objectContaining({
          appCode: 'FINANCE',
          appLevel: 'ADDCHANGE',
        }),
      }),
      expect.objectContaining({
        props: expect.objectContaining({
          appCode: 'STOREROOM',
          appLevel: 'READ',
        }),
      }),
      expect.objectContaining({
        props: expect.objectContaining({
          appCode: 'FINANCE',
          appLevel: 'DELETE',
        }),
      }),
    ])
  })
})
