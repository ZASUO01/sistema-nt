import { Either, left, right } from '@/domain/core/either'
import { UsersRepository } from '../repositories/users-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { User } from '../../enterprise/entities/user'
import { HashGenerator } from '../cryptography/hash-generator'

interface CreateUserUseCaseRequest {
  email: string
  firstName: string
  lastName: string
  password: string
  nick?: string
  phone?: string
}

type CreateUserUseCaseResponse = Either<UserAlreadyExistsError, { user: User }>

export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    email,
    firstName,
    lastName,
    password,
    nick,
    phone,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(email))
    }

    const passwordHash = await this.hashGenerator.hash(password)

    const user = User.create({
      email,
      firstName,
      lastName,
      passwordHash,
      nick,
      phone,
    })

    await this.usersRepository.create(user)

    return right({ user })
  }
}
