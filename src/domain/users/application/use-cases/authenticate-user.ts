import { Either, left, right } from '@/domain/core/either'
import { HashComparer } from '../cryptography/hash-comparer'
import { UsersRepository } from '../repositories/users-repository'
import { UnauthorizedActionError } from '@/domain/core/errors/unauthorized-action-error'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { LoginTracksRepository } from '../repositories/login-tracks-repository'
import { LoginTrack } from '../../enterprise/entities/login-track'
import { TokenGenerator } from '../cryptography/token-generator'
import { Token } from '../../enterprise/entities/value-objects/token'
import { shouldConsiderLastFailure } from '../utils/should-consider-last-failure'

interface AuthenticateUserUseCaseRequest {
  email: string
  password: string
  device?: string
  addr?: string
}

type AuthenticateUserUseCaseResponse = Either<
  InvalidCredentialsError | UnauthorizedActionError,
  { accessToken: Token; refreshToken: Token }
>

export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private loginTracksRepository: LoginTracksRepository,
    private hashComparer: HashComparer,
    private tokenGenerator: TokenGenerator,
  ) {}

  async execute({
    email,
    password,
    device,
    addr,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const userFound = await this.usersRepository.findByEmail(email)

    if (!userFound) {
      return left(new InvalidCredentialsError())
    }

    if (!userFound.isActive()) {
      return left(new UnauthorizedActionError())
    }

    const isValidPassword = await this.hashComparer.compare(
      password,
      userFound.passwordHash,
    )

    if (!isValidPassword) {
      const lastLoginTrack = await this.loginTracksRepository.findLastByUserId(
        userFound.id.toString(),
      )

      let previousSequence = 0
      if (lastLoginTrack) {
        if (shouldConsiderLastFailure(lastLoginTrack)) {
          previousSequence = lastLoginTrack.controlSequence
        }
      }

      if (previousSequence >= 2) {
        userFound.block()
        await this.usersRepository.save(userFound)
      }

      const loginTrack = LoginTrack.create({
        userId: userFound.id,
        state: 'FAILURE',
        controlSequence: previousSequence + 1,
      })
      await this.loginTracksRepository.create(loginTrack)

      return left(new InvalidCredentialsError())
    }

    const loginTrack = LoginTrack.create({
      userId: userFound.id,
      device,
      addr,
    })
    await this.loginTracksRepository.create(loginTrack)

    const accessToken = await this.tokenGenerator.sign({
      payload: { sub: userFound.id.toString(), level: userFound.level },
      type: 'ACCESS',
    })

    const refreshToken = await this.tokenGenerator.sign({
      payload: { sub: userFound.id.toString(), level: userFound.level },
      type: 'REFRESH',
    })

    return right({ accessToken, refreshToken })
  }
}
