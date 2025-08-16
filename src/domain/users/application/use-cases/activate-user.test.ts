import { InMemoryLoginTracksRepository } from '@/test/repositories/users/in-memory-login-tracks-repository'
import { InMemoryUsersRepository } from '@/test/repositories/users/in-memory-users-repository'
import { ActivateUserUseCase } from './activate-user'
import { User } from '../../enterprise/entities/user'
import { makeUser } from '@/test/factories/users/make-user'
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error'
import { makeLoginTrack } from '@/test/factories/users/make-login-track'

describe('(UNIT) Activate User', () => {
  let usersRepository: InMemoryUsersRepository
  let loginTracksRepository: InMemoryLoginTracksRepository
  let sut: ActivateUserUseCase
  let user: User

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    loginTracksRepository = new InMemoryLoginTracksRepository()
    sut = new ActivateUserUseCase(usersRepository, loginTracksRepository)

    user = makeUser({ status: 'INACTIVE' })
    await usersRepository.create(user)
  })

  it('should be able to activate an user', async () => {
    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(usersRepository.items[0].isActive()).toBe(true)
  })

  it('should not be able to activate an invalid user', async () => {
    const result = await sut.execute({
      userId: 'invalid-user',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should reset last login track control sequence', async () => {
    user.block()
    await usersRepository.save(user)

    await loginTracksRepository.create(
      makeLoginTrack({ userId: user.id, controlSequence: 3, state: 'FAILURE' }),
    )

    await sut.execute({
      userId: user.id.toString(),
    })

    expect(loginTracksRepository.items[0].controlSequence).toEqual(0)
  })

  it('should not reset last login track if it is old enough', async () => {
    vi.useFakeTimers()

    user.block()
    await usersRepository.save(user)

    await loginTracksRepository.create(
      makeLoginTrack({ userId: user.id, controlSequence: 3, state: 'FAILURE' }),
    )

    vi.advanceTimersByTime(1000 * 60 * 16)

    await sut.execute({
      userId: user.id.toString(),
    })

    expect(loginTracksRepository.items[0].controlSequence).toEqual(3)

    vi.useRealTimers()
  })
})
