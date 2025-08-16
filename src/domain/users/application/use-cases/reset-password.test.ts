import { InMemoryUsersRepository } from '@/test/repositories/users/in-memory-users-repository'
import { ResetPasswordUseCase } from './reset-password'
import { InMemoryPasswordResetHashesRepository } from '@/test/repositories/users/in-memory-password-reset-hashes-repository'
import { FakeHashComparer } from '@/test/cryptography/fake-hash-comparer'
import { FakeHashGenerator } from '@/test/cryptography/fake-hash-generator'
import { makeUser } from '@/test/factories/users/make-user'
import { PasswordResetHash } from '../../enterprise/entities/password-reset-hash'
import { InvalidResetHashError } from '../errors/invalid-reset-hash-error'
import { UniqueEntityId } from '@/domain/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error'
import { User } from '../../enterprise/entities/user'

describe('(UNIT) Reset Password', () => {
  let usersRepository: InMemoryUsersRepository
  let passwordResetHashesRepository: InMemoryPasswordResetHashesRepository
  let hashComparer: FakeHashComparer
  let hashGenerator: FakeHashGenerator
  let sut: ResetPasswordUseCase
  let passwordResetHash: PasswordResetHash
  let user: User

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    passwordResetHashesRepository = new InMemoryPasswordResetHashesRepository()
    hashComparer = new FakeHashComparer()
    hashGenerator = new FakeHashGenerator()
    sut = new ResetPasswordUseCase(
      usersRepository,
      passwordResetHashesRepository,
      hashComparer,
      hashGenerator,
    )

    user = makeUser()
    await usersRepository.create(user)

    passwordResetHash = PasswordResetHash.create({
      userId: user.id,
    })
    passwordResetHash.hash = await hashGenerator.hash(passwordResetHash.value)
    await passwordResetHashesRepository.create(passwordResetHash)
  })

  it('should be able to reset the user password', async () => {
    const result = await sut.execute({
      resetValue: passwordResetHash.value,
      newPassword: '123456',
    })

    const passwordHash = await hashGenerator.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeNull()
    expect(usersRepository.items[0].passwordHash).toEqual(passwordHash)
  })

  it('should not be able to reset the password from an invalid hash value', async () => {
    const result = await sut.execute({
      resetValue: 'invalid-hash',
      newPassword: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidResetHashError)
    expect(result.value?.message).toContain('malformed hash')
  })

  it('should not be able to reset the password of an invalid user', async () => {
    const newPasswordResetHash = PasswordResetHash.create({
      userId: new UniqueEntityId('invalid-id'),
    })

    const result = await sut.execute({
      resetValue: newPasswordResetHash.value,
      newPassword: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to reset the password if the hash is not found', async () => {
    const newPasswordResetHash = PasswordResetHash.create({
      userId: user.id,
    })
    newPasswordResetHash.hash = await hashGenerator.hash(
      newPasswordResetHash.value,
    )

    const result1 = await sut.execute({
      resetValue: newPasswordResetHash.value,
      newPassword: '123456',
    })

    expect(result1.isLeft()).toBe(true)
    expect(result1.value).toBeInstanceOf(InvalidResetHashError)
    expect(result1.value?.message).toContain('hash not found')

    await passwordResetHashesRepository.create(newPasswordResetHash)

    const result2 = await sut.execute({
      resetValue: newPasswordResetHash.value,
      newPassword: '123456',
    })

    expect(result2.isRight()).toBe(true)
  })

  it('should not be able to reset the password with an invalid hash', async () => {
    passwordResetHash.invalidate()
    await passwordResetHashesRepository.save(passwordResetHash)

    const result = await sut.execute({
      resetValue: passwordResetHash.value,
      newPassword: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidResetHashError)
    expect(result.value?.message).toContain('invalid hash')
  })

  it('should not be able to reset the password with an expired hash', async () => {
    vi.useFakeTimers()
    vi.advanceTimersByTime(PasswordResetHash.EXPIRATION_IN_MILISECONDS)
    vi.advanceTimersByTime(1000 * 60)

    const result = await sut.execute({
      resetValue: passwordResetHash.value,
      newPassword: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidResetHashError)
    expect(result.value?.message).toContain('expired hash')
  })
})
