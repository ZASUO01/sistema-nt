import { FakeHashComparer } from '@/test/cryptography/fake-hash-comparer'
import { FakeHashGenerator } from '@/test/cryptography/fake-hash-generator'
import { FakeTokenGenerator } from '@/test/cryptography/fake-token-generator'
import { InMemoryLoginTracksRepository } from '@/test/repositories/users/in-memory-login-tracks-repository'
import { InMemoryUsersRepository } from '@/test/repositories/users/in-memory-users-repository'
import { AuthenticateUserUseCase } from './authenticate-user'
import { makeUser } from '@/test/factories/users/make-user'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { UnauthorizedActionError } from '@/domain/core/errors/unauthorized-action-error'

describe('(UNIT) Authenticate User', () => {
  let usersRepository: InMemoryUsersRepository
  let loginTracksRepository: InMemoryLoginTracksRepository
  let hashComparer: FakeHashComparer
  let hashGenerator: FakeHashGenerator
  let tokenGenerator: FakeTokenGenerator
  let sut: AuthenticateUserUseCase

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    loginTracksRepository = new InMemoryLoginTracksRepository()
    hashComparer = new FakeHashComparer()
    tokenGenerator = new FakeTokenGenerator()
    sut = new AuthenticateUserUseCase(
      usersRepository,
      loginTracksRepository,
      hashComparer,
      tokenGenerator,
    )

    hashGenerator = new FakeHashGenerator()

    await usersRepository.create(
      makeUser({
        email: 'johndoe@example.com',
        passwordHash: await hashGenerator.hash('123456'),
      }),
    )
  })

  it('should be able to authenticate an user', async () => {
    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(Object),
      refreshToken: expect.any(Object),
    })
    expect(loginTracksRepository.items).toHaveLength(1)
    expect(loginTracksRepository.items[0]).toMatchObject({
      props: expect.objectContaining({ state: 'SUCCESS', controlSequence: 0 }),
    })
  })

  it('should not be able to authenticate with invalid email', async () => {
    const result = await sut.execute({
      email: 'invalid-email',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
    expect(loginTracksRepository.items).toHaveLength(0)
  })

  it('should not be able to authenticate a non-active user', async () => {
    usersRepository.items[0].block()

    const blockResult = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(blockResult.isLeft()).toBe(true)
    expect(blockResult.value).toBeInstanceOf(UnauthorizedActionError)

    usersRepository.items[0].deactivate()

    const inactiveResult = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(inactiveResult.isLeft()).toBe(true)
    expect(inactiveResult.value).toBeInstanceOf(UnauthorizedActionError)
  })

  it('should not be able to authenticate an user that exceeded the maximum  allowed failure attempts', async () => {
    vi.useFakeTimers()

    await sut.execute({
      email: 'johndoe@example.com',
      password: '4321',
    })

    vi.advanceTimersByTime(1000 * 60)

    await sut.execute({
      email: 'johndoe@example.com',
      password: '4321',
    })

    vi.advanceTimersByTime(1000 * 60)

    await sut.execute({
      email: 'johndoe@example.com',
      password: '4321',
    })

    vi.advanceTimersByTime(1000 * 60)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedActionError)

    expect(loginTracksRepository.items).toHaveLength(3)
    expect(loginTracksRepository.items).toEqual([
      expect.objectContaining({
        props: expect.objectContaining({
          state: 'FAILURE',
          controlSequence: 1,
        }),
      }),
      expect.objectContaining({
        props: expect.objectContaining({
          state: 'FAILURE',
          controlSequence: 2,
        }),
      }),
      expect.objectContaining({
        props: expect.objectContaining({
          state: 'FAILURE',
          controlSequence: 3,
        }),
      }),
    ])

    vi.useRealTimers()
  })

  it('should be able to authenticate an user that failed to authenticate in a suficient space of time', async () => {
    vi.useFakeTimers()

    await sut.execute({
      email: 'johndoe@example.com',
      password: '4321',
    })

    vi.advanceTimersByTime(1000 * 60)

    await sut.execute({
      email: 'johndoe@example.com',
      password: '4321',
    })

    vi.advanceTimersByTime(1000 * 60 * 16)

    await sut.execute({
      email: 'johndoe@example.com',
      password: '4321',
    })

    vi.advanceTimersByTime(1000 * 60)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)

    expect(loginTracksRepository.items).toHaveLength(4)
    expect(loginTracksRepository.items).toEqual([
      expect.objectContaining({
        props: expect.objectContaining({
          state: 'FAILURE',
          controlSequence: 1,
        }),
      }),
      expect.objectContaining({
        props: expect.objectContaining({
          state: 'FAILURE',
          controlSequence: 2,
        }),
      }),
      expect.objectContaining({
        props: expect.objectContaining({
          state: 'FAILURE',
          controlSequence: 1,
        }),
      }),
      expect.objectContaining({
        props: expect.objectContaining({
          state: 'SUCCESS',
          controlSequence: 0,
        }),
      }),
    ])

    vi.useRealTimers()
  })
})
