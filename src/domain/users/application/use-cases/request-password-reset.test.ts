import { InMemoryUsersRepository } from '@/test/repositories/users/in-memory-users-repository'
import { RequestPasswordResetUseCase } from './request-password-reset'
import { InMemoryPasswordResetHashesRepository } from '@/test/repositories/users/in-memory-password-reset-hashes-repository'
import { FakeHashGenerator } from '@/test/cryptography/fake-hash-generator'
import { User } from '../../enterprise/entities/user'
import { makeUser } from '@/test/factories/users/make-user'
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error'
import { UnavailableResourceError } from '@/domain/core/errors/unavailable-resourse-error'

describe('(UNIT) Request Password Reset', () => {
  let usersRepository: InMemoryUsersRepository
  let passwordResetHahesRepository: InMemoryPasswordResetHashesRepository
  let hashGenerator: FakeHashGenerator
  let sut: RequestPasswordResetUseCase
  let user: User

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    passwordResetHahesRepository = new InMemoryPasswordResetHashesRepository()
    hashGenerator = new FakeHashGenerator()
    sut = new RequestPasswordResetUseCase(
      usersRepository,
      passwordResetHahesRepository,
      hashGenerator,
    )

    user = makeUser()
    await usersRepository.create(user)
  })

  it('should be able to request a password reset', async () => {
    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      value: expect.any(String),
    })
    expect(passwordResetHahesRepository.items).toHaveLength(1)
    expect(passwordResetHahesRepository.items[0].isValid).toBe(true)
  })

  it('should not be able to request a password reset for an invalid user', async () => {
    const result = await sut.execute({
      userId: 'invalid-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to request a new password reset within 2 minutes', async () => {
    vi.useFakeTimers()

    await sut.execute({
      userId: user.id.toString(),
    })

    vi.advanceTimersByTime(1000 * 60)

    const earlyResult = await sut.execute({
      userId: user.id.toString(),
    })

    expect(earlyResult.isLeft()).toBe(true)
    expect(earlyResult.value).toBeInstanceOf(UnavailableResourceError)
    expect(passwordResetHahesRepository.items).toHaveLength(1)

    vi.advanceTimersByTime(1000 * 60)

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isRight()).toEqual(true)
    expect(passwordResetHahesRepository.items).toHaveLength(2)
    expect(passwordResetHahesRepository.items[0].isValid).toBe(false)
    expect(passwordResetHahesRepository.items[1].isValid).toBe(true)

    vi.useRealTimers()
  })

  it('should hash the generated password reset value', async () => {
    await sut.execute({
      userId: user.id.toString(),
    })

    const value = passwordResetHahesRepository.items[0].value

    expect(passwordResetHahesRepository.items[0].hash).toEqual(
      value.concat('-hashed'),
    )
  })
})
