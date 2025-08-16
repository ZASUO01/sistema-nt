import { PaginationParams } from '@/domain/core/repositories/pagination-params'
import { LoginTrack } from '../../enterprise/entities/login-track'

export abstract class LoginTracksRepository {
  abstract findLastByUserId(userId: string): Promise<LoginTrack | null>
  abstract findManyByUserId(
    params: PaginationParams,
    userId: string,
    beginAt: Date,
  ): Promise<LoginTrack[]>

  abstract create(loginTrack: LoginTrack): Promise<void>
  abstract save(loginTrack: LoginTrack): Promise<void>
  abstract deleteManyByUserId(userId: string): Promise<void>
}
