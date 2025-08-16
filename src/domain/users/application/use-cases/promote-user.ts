import { Either, left, right } from '@/domain/core/either'
import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error'

interface PromoteUserUseCaseRequest {
  userId: string
}

type PromoteUserUseCaseResponse = Either<ResourceNotFoundError, null>

export class PromoteUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: PromoteUserUseCaseRequest): Promise<PromoteUserUseCaseResponse> {
    const userFound = await this.usersRepository.findById(userId)

    if (!userFound) {
      return left(new ResourceNotFoundError(userId))
    }

    if (!userFound.isAdmin()) {
      userFound.promote()
      userFound.updatedAt = new Date()
      await this.usersRepository.save(userFound)
    }

    return right(null)
  }
}
