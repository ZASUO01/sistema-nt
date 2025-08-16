import { Either, left, right } from '@/domain/core/either'
import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error'
import { LoginTracksRepository } from '../repositories/login-tracks-repository'
import { UserAccessesRepository } from '../repositories/user-accesses-repository'
import { PasswordResetHashesRepository } from '../repositories/password-reset-hashes-repository'

interface DeleteUserUseCaseRequest {
  userId: string
}

type DeleteUserUseCaseResponse = Either<ResourceNotFoundError, null>

export class DeleteUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private loginTracksRepository: LoginTracksRepository,
    private userAcessesRepository: UserAccessesRepository,
    private passwordResetHashesRepository: PasswordResetHashesRepository,
  ) {}

  async execute({
    userId,
  }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
    const userFound = await this.usersRepository.findById(userId)

    if (!userFound) {
      return left(new ResourceNotFoundError(userId))
    }

    await this.userAcessesRepository.deleteManyByUserId(userId)
    await this.passwordResetHashesRepository.deleteManyByUserId(userId)
    await this.loginTracksRepository.deleteManyByUserId(userId)
    await this.usersRepository.deleteById(userId)

    return right(null)
  }
}
