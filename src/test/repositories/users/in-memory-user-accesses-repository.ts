import { UserAccessesRepository } from '@/domain/users/application/repositories/user-accesses-repository'
import { UserAccess } from '@/domain/users/enterprise/entities/user-access'

export class InMemoryUserAccessesRepository implements UserAccessesRepository {
  public items: UserAccess[] = []

  async findManyByUserId(userId: string): Promise<UserAccess[]> {
    return this.items.filter((item) => item.userId.toString() === userId)
  }

  async createMany(userAccesses: UserAccess[]): Promise<void> {
    this.items.push(...userAccesses)
  }

  async deleteMany(userAccesses: UserAccess[]): Promise<void> {
    const idsToRemove = new Set(userAccesses.map((ua) => ua.id.toString()))
    const newItems = this.items.filter(
      (item) => !idsToRemove.has(item.id.toString()),
    )

    this.items = newItems
  }

  async deleteManyByUserId(userId: string): Promise<void> {
    const newItems = this.items.filter(
      (item) => item.userId.toString() !== userId,
    )
    this.items = newItems
  }
}
