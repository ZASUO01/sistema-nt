import { Either, left, right } from '@/domain/core/either'
import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error'

interface DeactivateUserUseCaseRequest {
  userId: string
}

type DeactivateUserUseCaseResponse = Either<ResourceNotFoundError, null>

export class DeactivateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: DeactivateUserUseCaseRequest): Promise<DeactivateUserUseCaseResponse> {
    const userFound = await this.usersRepository.findById(userId)

    if (!userFound) {
      return left(new ResourceNotFoundError(userId))
    }

    if (!userFound.isInactive()) {
      userFound.deactivate()
      userFound.updatedAt = new Date()
      await this.usersRepository.save(userFound)
    }

    return right(null)
  }
}
