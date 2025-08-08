import { Either, left, right } from '@/domain/core/either'
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error'
import { UsersRepository } from '../repositories/users-repository'

interface DeleteUserUserCaseRequest {
  userId: string
}

type DeleteUserUserCaseResponse = Either<ResourceNotFoundError, null>

export class DeleteUserUserCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: DeleteUserUserCaseRequest): Promise<DeleteUserUserCaseResponse> {
    const userFound = await this.usersRepository.findById(userId)

    if (!userFound) {
      return left(new ResourceNotFoundError(userId))
    }

    await this.usersRepository.deleteById(userId)

    return right(null)
  }
}
