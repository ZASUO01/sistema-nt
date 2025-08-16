import { PaginationParams } from '@/domain/core/repositories/pagination-params'
import { LoginTracksRepository } from '@/domain/users/application/repositories/login-tracks-repository'
import { LoginTrack } from '@/domain/users/enterprise/entities/login-track'

export class InMemoryLoginTracksRepository implements LoginTracksRepository {
  public items: LoginTrack[] = []

  async findLastByUserId(userId: string): Promise<LoginTrack | null> {
    const userLoginTracks = this.items
      .filter((item) => item.userId.toString() === userId)
      .sort((a, b) => b.ocurredAt.getTime() - a.ocurredAt.getTime())

    if (userLoginTracks.length > 0) {
      return userLoginTracks[0]
    }

    return null
  }

  async findManyByUserId(
    params: PaginationParams,
    userId: string,
    beginAt: Date,
  ): Promise<LoginTrack[]> {
    return this.items
      .filter(
        (item) =>
          item.userId.toString() === userId && item.ocurredAt >= beginAt,
      )
      .sort((a, b) => b.ocurredAt.getTime() - a.ocurredAt.getTime())
      .slice((params.page - 1) * params.take, params.page * params.take)
  }

  async create(loginTrack: LoginTrack): Promise<void> {
    this.items.push(loginTrack)
  }

  async save(loginTrack: LoginTrack): Promise<void> {
    const idx = this.items.findIndex((item) => item.id.equals(loginTrack.id))

    this.items[idx] = loginTrack
  }

  async deleteManyByUserId(userId: string): Promise<void> {
    const newItems = this.items.filter(
      (item) => item.userId.toString() !== userId,
    )

    this.items = newItems
  }
}
