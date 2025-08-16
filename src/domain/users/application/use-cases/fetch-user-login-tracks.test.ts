import { InMemoryLoginTracksRepository } from '@/test/repositories/users/in-memory-login-tracks-repository'
import { FetchUserLoginTracks } from './fetch-user-login-tracks'
import { User } from '../../enterprise/entities/user'
import { makeUser } from '@/test/factories/users/make-user'
import { makeLoginTrack } from '@/test/factories/users/make-login-track'

describe('(UNIT) Fetch User Login Tracks', () => {
  let loginTracksRepository: InMemoryLoginTracksRepository
  let sut: FetchUserLoginTracks
  let user: User

  beforeEach(async () => {
    loginTracksRepository = new InMemoryLoginTracksRepository()
    sut = new FetchUserLoginTracks(loginTracksRepository)

    user = makeUser()
  })

  it('should be able to fetch the user login tracks', async () => {
    for (let i = 0; i < 10; i++) {
      await loginTracksRepository.create(makeLoginTrack({ userId: user.id }))
    }

    const result = await sut.execute({
      userId: user.id.toString(),
      beginAt: user.createdAt,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.loginTracks).toHaveLength(10)
  })

  it('should be able to fetch paginated login tracks', async () => {
    for (let i = 0; i < 12; i++) {
      await loginTracksRepository.create(makeLoginTrack({ userId: user.id }))
    }

    const result = await sut.execute({
      page: 2,
      take: 6,
      userId: user.id.toString(),
      beginAt: user.createdAt,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.loginTracks).toHaveLength(6)
  })

  it('should be able to fetch login tracks beginig at a given date', async () => {
    vi.useFakeTimers()

    await loginTracksRepository.create(makeLoginTrack({ userId: user.id }))

    vi.advanceTimersByTime(1000 * 60)

    const now = new Date()
    await loginTracksRepository.create(makeLoginTrack({ userId: user.id }))

    const result = await sut.execute({
      userId: user.id.toString(),
      beginAt: now,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.loginTracks).toHaveLength(1)

    vi.useRealTimers()
  })
})
