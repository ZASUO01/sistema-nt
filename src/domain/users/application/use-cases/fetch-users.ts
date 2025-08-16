import { Either, right } from '@/domain/core/either'
import { UsersRepository } from '../repositories/users-repository'
import { User } from '../../enterprise/entities/user'

interface FetchUsersUseCaseRequest {
  page?: number
  take?: number
}

type FetchUsersUseCaseResponse = Either<null, { users: User[] }>

export class FetchUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    page,
    take,
  }: FetchUsersUseCaseRequest): Promise<FetchUsersUseCaseResponse> {
    const users = await this.usersRepository.findMany({
      page: page ?? 1,
      take: take ?? 10,
    })

    return right({ users })
  }
}
