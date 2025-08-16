import { PasswordResetHashesRepository } from '@/domain/users/application/repositories/password-reset-hashes-repository'
import { PasswordResetHash } from '@/domain/users/enterprise/entities/password-reset-hash'

export class InMemoryPasswordResetHashesRepository
  implements PasswordResetHashesRepository
{
  public items: PasswordResetHash[] = []

  async findLastByUserId(userId: string): Promise<PasswordResetHash | null> {
    const passwordResetHashes = this.items
      .filter((item) => item.userId.toString() === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    if (passwordResetHashes.length > 0) {
      return passwordResetHashes[0]
    }

    return null
  }

  async findManyRecentByUserId(userId: string): Promise<PasswordResetHash[]> {
    return this.items
      .filter((item) => item.userId.toString() === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async create(passwordResetHash: PasswordResetHash): Promise<void> {
    this.items.push(passwordResetHash)
  }

  async save(passwordResetHash: PasswordResetHash): Promise<void> {
    const idx = this.items.findIndex((item) =>
      item.id.equals(passwordResetHash.id),
    )

    this.items[idx] = passwordResetHash
  }

  async deleteManyByUserId(userId: string): Promise<void> {
    const newItems = this.items.filter(
      (item) => item.userId.toString() !== userId,
    )

    this.items = newItems
  }
}
