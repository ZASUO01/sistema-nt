import { UnauthorizedActionError } from '@/domain/core/errors/unauthorized-action-error'
import { TokenGenerator } from '../cryptography/token-generator'
import { TokenVerifier } from '../cryptography/token-verifier'
import {
  Token,
  TokenPayload,
} from '../../enterprise/entities/value-objects/token'
import { Either, left, right } from '@/domain/core/either'

interface RefreshTokenUseCaseRequest {
  value: string
  payload: TokenPayload
}

type RefreshTokenUseCaseResponse = Either<
  UnauthorizedActionError,
  { accessToken: Token; refreshToken: Token }
>

export class RefreshTokenUseCase {
  constructor(
    private tokenVerifier: TokenVerifier,
    private tokenGenerator: TokenGenerator,
  ) {}

  async execute({
    value,
    payload,
  }: RefreshTokenUseCaseRequest): Promise<RefreshTokenUseCaseResponse> {
    const tokenVerified = await this.tokenVerifier.verify(value)

    if (!tokenVerified) {
      return left(new UnauthorizedActionError())
    }

    const accessToken = await this.tokenGenerator.sign({
      payload,
      type: 'ACCESS',
    })

    const refreshToken = await this.tokenGenerator.sign({
      payload,
      type: 'REFRESH',
    })

    return right({
      accessToken,
      refreshToken,
    })
  }
}
