import { Either, left, right } from '@/domain/core/either'
import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error'

interface DemoteUserUseCaseRequest {
  userId: string
}

type DemoteUserUseCaseResponse = Either<ResourceNotFoundError, null>

export class DemoteUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: DemoteUserUseCaseRequest): Promise<DemoteUserUseCaseResponse> {
    const userFound = await this.usersRepository.findById(userId)

    if (!userFound) {
      return left(new ResourceNotFoundError(userId))
    }

    if (userFound.isAdmin()) {
      userFound.demote()
      userFound.updatedAt = new Date()
      await this.usersRepository.save(userFound)
    }

    return right(null)
  }
}
