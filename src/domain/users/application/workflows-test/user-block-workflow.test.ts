import { InMemoryLoginTracksRepository } from '@/test/repositories/users/in-memory-login-tracks-repository'
import { InMemoryUsersRepository } from '@/test/repositories/users/in-memory-users-repository'
import { AuthenticateUserUseCase } from '../use-cases/authenticate-user'
import { FakeHashComparer } from '@/test/cryptography/fake-hash-comparer'
import { FakeHashGenerator } from '@/test/cryptography/fake-hash-generator'
import { FakeTokenGenerator } from '@/test/cryptography/fake-token-generator'
import { ActivateUserUseCase } from '../use-cases/activate-user'
import { User } from '../../enterprise/entities/user'
import { makeUser } from '@/test/factories/users/make-user'

describe('User Block Workflow', () => {
  let usersRepository: InMemoryUsersRepository
  let loginTracksRepository: InMemoryLoginTracksRepository
  let authUseCase: AuthenticateUserUseCase
  let hashComparer: FakeHashComparer
  let hashGenerator: FakeHashGenerator
  let tokenGenerator: FakeTokenGenerator
  let activateUseCase: ActivateUserUseCase
  let user: User

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    loginTracksRepository = new InMemoryLoginTracksRepository()
    hashComparer = new FakeHashComparer()
    hashGenerator = new FakeHashGenerator()
    tokenGenerator = new FakeTokenGenerator()
    authUseCase = new AuthenticateUserUseCase(
      usersRepository,
      loginTracksRepository,
      hashComparer,
      tokenGenerator,
    )
    activateUseCase = new ActivateUserUseCase(
      usersRepository,
      loginTracksRepository,
    )

    user = makeUser({
      email: 'johndoe@example.com',
      passwordHash: await hashGenerator.hash('123456'),
    })
    await usersRepository.create(user)
  })

  it('should be able to authenticate a reactivated user', async () => {
    vi.useFakeTimers()

    await authUseCase.execute({
      email: 'johndoe@example.com',
      password: 'invalid-password',
    })

    vi.advanceTimersByTime(1000 * 30)

    await authUseCase.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    vi.advanceTimersByTime(1000 * 30)

    await authUseCase.execute({
      email: 'johndoe@example.com',
      password: 'invalid-password',
    })

    vi.advanceTimersByTime(1000 * 30)

    await authUseCase.execute({
      email: 'johndoe@example.com',
      password: 'invalid-password',
    })

    vi.advanceTimersByTime(1000 * 30)

    await authUseCase.execute({
      email: 'johndoe@example.com',
      password: 'invalid-password',
    })

    expect(usersRepository.items[0].isBlocked()).toBe(true)
    expect(loginTracksRepository.items).toHaveLength(5)
    expect(loginTracksRepository.items[4].controlSequence).toEqual(3)

    vi.advanceTimersByTime(1000 * 30)

    await activateUseCase.execute({ userId: user.id.toString() })

    expect(usersRepository.items[0].isActive()).toBe(true)
    expect(loginTracksRepository.items[4].controlSequence).toEqual(0)

    vi.advanceTimersByTime(1000 * 30)

    await authUseCase.execute({
      email: 'johndoe@example.com',
      password: 'invalid-password',
    })

    expect(loginTracksRepository.items).toHaveLength(6)
    expect(loginTracksRepository.items[5].controlSequence).toEqual(1)

    vi.advanceTimersByTime(1000 * 30)

    const result = await authUseCase.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)

    vi.useRealTimers()
  })
})
