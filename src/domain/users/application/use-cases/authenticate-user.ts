import { Either, left, right } from '@/domain/core/either'
import { UsersRepository } from '../repositories/users-repository'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { HashComparer } from '../cryptography/hash-comparer'
import { TokenGenerator } from '../cryptography/token-generator'
import { BlockeUserError } from '../errors/blocked-user-error'
import { Injectable } from '@nestjs/common'

interface AuthenticateUserUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUserUseCaseResponse = Either<
  InvalidCredentialsError | BlockeUserError,
  { accessToken: string; refreshToken: string }
>

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private tokenGenerator: TokenGenerator,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const userFound = await this.usersRepository.findByEmail(email)

    if (!userFound) {
      return left(new InvalidCredentialsError())
    }

    if (!userFound.isActive()) {
      return left(new BlockeUserError())
    }

    const isValidPassword = await this.hashComparer.compare(
      password,
      userFound.passwordHash,
    )

    if (!isValidPassword) {
      return left(new InvalidCredentialsError())
    }

    const accessToken = await this.tokenGenerator.generate(
      {
        sub: userFound.id.toString(),
        role: userFound.level,
      },
      'ACCESS',
    )

    const refreshToken = await this.tokenGenerator.generate(
      {
        sub: userFound.id.toString(),
      },
      'REFRESH',
    )

    return right({
      accessToken,
      refreshToken,
    })
  }
}
