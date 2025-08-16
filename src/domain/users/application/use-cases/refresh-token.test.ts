import { FakeTokenGenerator } from '@/test/cryptography/fake-token-generator'
import { FakeTokenVerifier } from '@/test/cryptography/fake-token-verifier'
import { RefreshTokenUseCase } from './refresh-token'
import { UserLevel } from '../../enterprise/entities/user'
import { UniqueEntityId } from '@/domain/core/entities/unique-entity-id'
import { UnauthorizedActionError } from '@/domain/core/errors/unauthorized-action-error'

describe('(UNIT) Refresh Token', () => {
  let tokenVerifier: FakeTokenVerifier
  let tokenGenerator: FakeTokenGenerator
  let sut: RefreshTokenUseCase
  let userId: string
  let level: UserLevel

  beforeEach(() => {
    tokenVerifier = new FakeTokenVerifier()
    tokenGenerator = new FakeTokenGenerator()
    sut = new RefreshTokenUseCase(tokenVerifier, tokenGenerator)

    userId = new UniqueEntityId().toString()
    level = 'DEFAULT'
  })

  it('should be able to get new tokens from a refresh token', async () => {
    const refreshToken = await tokenGenerator.sign({
      payload: { sub: userId, level },
      type: 'REFRESH',
    })

    const result = await sut.execute({
      value: refreshToken.value,
      payload: { sub: userId, level },
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      accessToken: expect.any(Object),
      refreshToken: expect.any(Object),
    })
  })

  it('should not get new tokens from an invalid refresh token', async () => {
    const result = await sut.execute({
      value: 'invalid-token',
      payload: { sub: userId, level },
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedActionError)
  })
})
