import { Either, left, right } from '@/domain/core/either'
import { HashComparer } from '../cryptography/hash-comparer'
import { HashGenerator } from '../cryptography/hash-generator'
import { PasswordResetHashesRepository } from '../repositories/password-reset-hashes-repository'
import { UsersRepository } from '../repositories/users-repository'
import { InvalidResetHashError } from '../errors/invalid-reset-hash-error'
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error'

interface ResetPasswordUseCaseRequest {
  resetValue: string
  newPassword: string
}

type ResetPasswordUseCaseResponse = Either<
  InvalidResetHashError | ResourceNotFoundError,
  null
>

export class ResetPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private passwordResetHashesRepository: PasswordResetHashesRepository,
    private hashComparer: HashComparer,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    resetValue,
    newPassword,
  }: ResetPasswordUseCaseRequest): Promise<ResetPasswordUseCaseResponse> {
    const decoded = Buffer.from(resetValue, 'base64url').toString()
    const [randomPart, expiration, userId] = decoded.split(':')

    if (!randomPart || !expiration || !userId) {
      return left(new InvalidResetHashError('malformed hash'))
    }

    const userFound = await this.usersRepository.findById(userId)

    if (!userFound) {
      return left(new ResourceNotFoundError(userId))
    }

    const passwordResetHashes =
      await this.passwordResetHashesRepository.findManyRecentByUserId(userId)

    const hit = await Promise.all(
      passwordResetHashes.map(async (resetHash) => {
        const match = await this.hashComparer.compare(
          resetValue,
          resetHash.hash,
        )
        return match ? resetHash : null
      }),
    ).then((results) => results.find(Boolean))

    if (!hit) {
      return left(new InvalidResetHashError('hash not found'))
    }

    if (!hit.isValid) {
      return left(new InvalidResetHashError('invalid hash'))
    }

    const hasExpired = Date.now() > hit.expiresAt.getTime()
    if (hasExpired) {
      return left(new InvalidResetHashError('expired hash'))
    }

    hit.invalidate()
    await this.passwordResetHashesRepository.save(hit)

    const passwordHash = await this.hashGenerator.hash(newPassword)
    userFound.passwordHash = passwordHash
    await this.usersRepository.save(userFound)

    return right(null)
  }
}
