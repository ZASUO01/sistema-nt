import { Either, right } from '@/domain/core/either'
import { UserAccessesRepository } from '../repositories/user-accesses-repository'
import { UserAccess } from '../../enterprise/entities/user-access'

interface FetchUserAccessesUseCaseRequest {
  userId: string
}

type FetchUserAccessesUseCaseResponse = Either<
  null,
  { userAccesses: UserAccess[] }
>

export class FetchUserAccessesUseCase {
  constructor(private userAccessesRepository: UserAccessesRepository) {}

  async execute({
    userId,
  }: FetchUserAccessesUseCaseRequest): Promise<FetchUserAccessesUseCaseResponse> {
    const userAccesses =
      await this.userAccessesRepository.findManyByUserId(userId)

    return right({ userAccesses })
  }
}
