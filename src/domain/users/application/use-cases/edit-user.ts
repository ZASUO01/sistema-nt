import { Either, left, right } from '@/domain/core/either'
import { UsersRepository } from '../repositories/users-repository'
import { User } from '../../enterprise/entities/user'
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error'

interface EditUserUseCaseRequest {
  userId: string
  firstName: string
  lastName: string
  nick?: string
  phone?: string
}

type EditUserUseCaseResponse = Either<ResourceNotFoundError, { user: User }>

export class EditUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    firstName,
    lastName,
    nick,
    phone,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    const userFound = await this.usersRepository.findById(userId)

    if (!userFound) {
      return left(new ResourceNotFoundError(userId))
    }

    userFound.firstName = firstName
    userFound.lastName = lastName
    if (nick) {
      userFound.nick = nick
    }

    if (phone) {
      userFound.phone = phone
    }

    userFound.updatedAt = new Date()

    await this.usersRepository.save(userFound)

    return right({ user: userFound })
  }
}
