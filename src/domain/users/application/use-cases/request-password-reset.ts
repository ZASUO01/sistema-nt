import { Either, left, right } from '@/domain/core/either'
import { HashGenerator } from '../cryptography/hash-generator'
import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error'
import { PasswordResetHash } from '../../enterprise/entities/password-reset-hash'
import { PasswordResetHashesRepository } from '../repositories/password-reset-hashes-repository'
import { UnavailableResourceError } from '@/domain/core/errors/unavailable-resourse-error'

interface RequestPasswordResetUseCaseRequest {
  userId: string
}

type RequestPasswordResetUseCaseResponse = Either<
  ResourceNotFoundError | UnavailableResourceError,
  { value: string }
>

export class RequestPasswordResetUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private passwordResetHashesRepository: PasswordResetHashesRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    userId,
  }: RequestPasswordResetUseCaseRequest): Promise<RequestPasswordResetUseCaseResponse> {
    const userFound = await this.usersRepository.findById(userId)

    if (!userFound) {
      return left(new ResourceNotFoundError(userId))
    }

    const lastPasswordResetHash =
      await this.passwordResetHashesRepository.findLastByUserId(
        userFound.id.toString(),
      )

    if (lastPasswordResetHash) {
      const timeDiff = Date.now() - lastPasswordResetHash.createdAt.getTime()

      if (timeDiff < PasswordResetHash.REQUEST_COOLDOWN_IN_MILISECONDS) {
        return left(new UnavailableResourceError())
      }

      if (lastPasswordResetHash.isValid) {
        lastPasswordResetHash.invalidate()
        await this.passwordResetHashesRepository.save(lastPasswordResetHash)
      }
    }

    const passwordResetHash = PasswordResetHash.create({
      userId: userFound.id,
    })

    passwordResetHash.hash = await this.hashGenerator.hash(
      passwordResetHash.value,
    )

    await this.passwordResetHashesRepository.create(passwordResetHash)

    return right({ value: passwordResetHash.value })
  }
}
