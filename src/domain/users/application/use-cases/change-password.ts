import { Either, left, right } from '@/domain/core/either'
import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error'
import { HashGenerator } from '../cryptography/hash-generator'

interface ChangePasswordUseCaseRequest {
  userId: string
  password: string
}

type ChangePasswordUseCaseResponse = Either<ResourceNotFoundError, null>

export class ChangePasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    userId,
    password,
  }: ChangePasswordUseCaseRequest): Promise<ChangePasswordUseCaseResponse> {
    const userFound = await this.usersRepository.findById(userId)

    if (!userFound) {
      return left(new ResourceNotFoundError(userId))
    }

    const newPasswordHash = await this.hashGenerator.hash(password)
    userFound.passwordHash = newPasswordHash

    await this.usersRepository.save(userFound)

    return right(null)
  }
}
