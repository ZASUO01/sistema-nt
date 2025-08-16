import { Either, left, right } from '@/domain/core/either'
import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error'
import { LoginTracksRepository } from '../repositories/login-tracks-repository'
import { shouldConsiderLastFailure } from '../utils/should-consider-last-failure'

interface ActivateUserUseCaseRequest {
  userId: string
}

type ActivateUserUseCaseResponse = Either<ResourceNotFoundError, null>

export class ActivateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private loginTracksRepository: LoginTracksRepository,
  ) {}

  async execute({
    userId,
  }: ActivateUserUseCaseRequest): Promise<ActivateUserUseCaseResponse> {
    const userFound = await this.usersRepository.findById(userId)

    if (!userFound) {
      return left(new ResourceNotFoundError(userId))
    }

    if (!userFound.isActive()) {
      if (userFound.isBlocked()) {
        const lastLoginTrack =
          await this.loginTracksRepository.findLastByUserId(
            userFound.id.toString(),
          )

        if (lastLoginTrack) {
          if (shouldConsiderLastFailure(lastLoginTrack)) {
            lastLoginTrack.controlSequence = 0
            await this.loginTracksRepository.save(lastLoginTrack)
          }
        }
      }

      userFound.activate()
      await this.usersRepository.save(userFound)
    }

    return right(null)
  }
}
