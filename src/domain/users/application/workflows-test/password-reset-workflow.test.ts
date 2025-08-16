import { InMemoryLoginTracksRepository } from '@/test/repositories/users/in-memory-login-tracks-repository'
import { InMemoryUsersRepository } from '@/test/repositories/users/in-memory-users-repository'
import { AuthenticateUserUseCase } from '../use-cases/authenticate-user'
import { FakeHashComparer } from '@/test/cryptography/fake-hash-comparer'
import { FakeHashGenerator } from '@/test/cryptography/fake-hash-generator'
import { FakeTokenGenerator } from '@/test/cryptography/fake-token-generator'
import { User } from '../../enterprise/entities/user'
import { makeUser } from '@/test/factories/users/make-user'
import { InMemoryPasswordResetHashesRepository } from '@/test/repositories/users/in-memory-password-reset-hashes-repository'
import { RequestPasswordResetUseCase } from '../use-cases/request-password-reset'
import { ResetPasswordUseCase } from '../use-cases/reset-password'
import { InvalidResetHashError } from '../errors/invalid-reset-hash-error'

describe('Password Reset Workflow', () => {
  let usersRepository: InMemoryUsersRepository
  let loginTracksRepository: InMemoryLoginTracksRepository
  let passwordResetHashesRepository: InMemoryPasswordResetHashesRepository
  let authUseCase: AuthenticateUserUseCase
  let hashComparer: FakeHashComparer
  let hashGenerator: FakeHashGenerator
  let tokenGenerator: FakeTokenGenerator
  let resetPasswordUseCase: ResetPasswordUseCase
  let requestPasswordResetUseCase: RequestPasswordResetUseCase
  let user: User

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    loginTracksRepository = new InMemoryLoginTracksRepository()
    passwordResetHashesRepository = new InMemoryPasswordResetHashesRepository()
    hashComparer = new FakeHashComparer()
    hashGenerator = new FakeHashGenerator()
    tokenGenerator = new FakeTokenGenerator()
    authUseCase = new AuthenticateUserUseCase(
      usersRepository,
      loginTracksRepository,
      hashComparer,
      tokenGenerator,
    )

    requestPasswordResetUseCase = new RequestPasswordResetUseCase(
      usersRepository,
      passwordResetHashesRepository,
      hashGenerator,
    )

    resetPasswordUseCase = new ResetPasswordUseCase(
      usersRepository,
      passwordResetHashesRepository,
      hashComparer,
      hashGenerator,
    )

    user = makeUser({
      email: 'johndoe@example.com',
      passwordHash: await hashGenerator.hash('123456'),
    })
    await usersRepository.create(user)
  })

  it('should be able to get a reset hash and reset the user password', async () => {
    vi.useFakeTimers()

    let authResult = await authUseCase.execute({
      email: 'johndoe@example.com',
      password: 'invalid-password',
    })

    expect(authResult.isLeft()).toBe(true)

    vi.advanceTimersByTime(1000 * 10)

    let requestResult = await requestPasswordResetUseCase.execute({
      userId: user.id.toString(),
    })

    expect(requestResult.isRight()).toBe(true)
    expect(passwordResetHashesRepository.items).toHaveLength(1)

    vi.advanceTimersByTime(1000 * 60)

    requestResult = await requestPasswordResetUseCase.execute({
      userId: user.id.toString(),
    })

    expect(requestResult.isLeft()).toBe(true)
    expect(passwordResetHashesRepository.items).toHaveLength(1)

    vi.advanceTimersByTime(1000 * 60 * 2)

    requestResult = await requestPasswordResetUseCase.execute({
      userId: user.id.toString(),
    })

    expect(requestResult.isRight()).toBe(true)
    expect(passwordResetHashesRepository.items).toHaveLength(2)
    expect(passwordResetHashesRepository.items[0].isValid).toBe(false)
    expect(passwordResetHashesRepository.items[1].isValid).toBe(true)

    let resetResult = await resetPasswordUseCase.execute({
      resetValue: passwordResetHashesRepository.items[0].value,
      newPassword: '',
    })

    expect(resetResult.isLeft()).toBe(true)
    expect(resetResult.value).toBeInstanceOf(InvalidResetHashError)

    resetResult = await resetPasswordUseCase.execute({
      resetValue: passwordResetHashesRepository.items[1].value,
      newPassword: 'reset',
    })

    expect(resetResult.isRight()).toBe(true)

    vi.advanceTimersByTime(1000 * 60 * 16)

    resetResult = await resetPasswordUseCase.execute({
      resetValue: passwordResetHashesRepository.items[1].value,
      newPassword: 'reset',
    })

    expect(resetResult.isLeft()).toBe(true)
    expect(resetResult.value).toBeInstanceOf(InvalidResetHashError)

    authResult = await authUseCase.execute({
      email: 'johndoe@example.com',
      password: 'reset',
    })

    expect(authResult.isRight()).toBe(true)

    vi.useRealTimers()
  })
})
