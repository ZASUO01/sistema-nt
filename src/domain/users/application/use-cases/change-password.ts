import { Either, left, right } from '@/domain/core/either'
import { HashComparer } from '../cryptography/hash-comparer'
import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { HashGenerator } from '../cryptography/hash-generator'

interface ChangePasswordUseCaseRequest {
  userId: string
  oldPassword: string
  password: string
}

type ChangePasswordUseCaseResponse = Either<
  ResourceNotFoundError | InvalidCredentialsError,
  null
>

export class ChangePasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    userId,
    oldPassword,
    password,
  }: ChangePasswordUseCaseRequest): Promise<ChangePasswordUseCaseResponse> {
    const userFound = await this.usersRepository.findById(userId)

    if (!userFound) {
      return left(new ResourceNotFoundError(userId))
    }

    const isValidPassword = await this.hashComparer.compare(
      oldPassword,
      userFound.passwordHash,
    )

    if (!isValidPassword) {
      return left(new InvalidCredentialsError())
    }

    const passwordHash = await this.hashGenerator.hash(password)

    userFound.passwordHash = passwordHash
    userFound.updatedAt = new Date()

    await this.usersRepository.save(userFound)

    return right(null)
  }
}
