import { Either, right } from '@/domain/core/either'
import { LoginTrack } from '../../enterprise/entities/login-track'
import { LoginTracksRepository } from '../repositories/login-tracks-repository'

interface FetchUserLoginTracksRequest {
  page?: number
  take?: number
  userId: string
  beginAt: Date
}

type FetchUserLoginTracksResponse = Either<null, { loginTracks: LoginTrack[] }>

export class FetchUserLoginTracks {
  constructor(private loginTracksRepository: LoginTracksRepository) {}

  async execute({
    page,
    take,
    userId,
    beginAt,
  }: FetchUserLoginTracksRequest): Promise<FetchUserLoginTracksResponse> {
    const loginTracks = await this.loginTracksRepository.findManyByUserId(
      { page: page ?? 1, take: take ?? 10 },
      userId,
      beginAt,
    )

    return right({ loginTracks })
  }
}
