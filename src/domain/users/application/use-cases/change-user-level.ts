import { Either, left, right } from '@/domain/core/either'
import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error'
import { UserLevel } from '../../enterprise/entities/user'

interface ChangeUserLevelUseCaseRequest {
  userId: string
  level: UserLevel
}

type ChangeUserLevelUseCaseResponse = Either<ResourceNotFoundError, null>

export class ChangeUserLevelUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    level,
  }: ChangeUserLevelUseCaseRequest): Promise<ChangeUserLevelUseCaseResponse> {
    const userFound = await this.usersRepository.findById(userId)

    if (!userFound) {
      return left(new ResourceNotFoundError(userId))
    }

    if (level !== userFound.level) {
      userFound.level = level
      await this.usersRepository.save(userFound)
    }

    return right(null)
  }
}
