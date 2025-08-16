import { Either, left, right } from '@/domain/core/either'
import {
  UserAccess,
  UserAccessDetail,
} from '../../enterprise/entities/user-access'
import { UserAccessesRepository } from '../repositories/user-accesses-repository'
import { UsersRepository } from '../repositories/users-repository'
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error'
import { UniqueEntityId } from '@/domain/core/entities/unique-entity-id'
import { UserAccessesList } from '../../enterprise/entities/user-accesses-list'

interface ChangeUserAccessesUseCaseRequest {
  userId: string
  userAccessDetails: UserAccessDetail[]
}

type ChangeUserAccessesUseCaseResponse = Either<ResourceNotFoundError, null>

export class ChangeUserAccessesUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private userAccessesRepository: UserAccessesRepository,
  ) {}

  async execute({
    userId,
    userAccessDetails,
  }: ChangeUserAccessesUseCaseRequest): Promise<ChangeUserAccessesUseCaseResponse> {
    const userFound = await this.usersRepository.findById(userId)

    if (!userFound) {
      return left(new ResourceNotFoundError(userId))
    }

    const currentAccesses =
      await this.userAccessesRepository.findManyByUserId(userId)
    const accessesList = new UserAccessesList(currentAccesses)

    const uniqueNewAccesses = [
      ...new Map(
        userAccessDetails.map((userAccessDetail) => {
          return [
            `${userAccessDetail.appCode}|${userAccessDetail.appLevel}`,
            UserAccess.create({
              userId: new UniqueEntityId(userId),
              appCode: userAccessDetail.appCode,
              appLevel: userAccessDetail.appLevel,
            }),
          ]
        }),
      ).values(),
    ]

    accessesList.update(uniqueNewAccesses)
    await this.userAccessesRepository.createMany(accessesList.getNewItems())
    await this.userAccessesRepository.deleteMany(accessesList.getRemovedItems())

    return right(null)
  }
}
