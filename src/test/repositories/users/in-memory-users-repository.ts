import { PaginationParams } from '@/domain/core/repositories/pagination-params'
import { UsersRepository } from '@/domain/users/application/repositories/users-repository'
import { User } from '@/domain/users/enterprise/entities/user'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id.toString() === id)

    if (!user) {
      return null
    }

    return user
  }

  async findMany(params: PaginationParams): Promise<User[]> {
    return this.items.slice(
      (params.page - 1) * params.take,
      params.page * params.take,
    )
  }

  async create(user: User): Promise<void> {
    this.items.push(user)
  }

  async save(user: User): Promise<void> {
    const idx = this.items.findIndex((item) => item.id.equals(user.id))

    this.items[idx] = user
  }

  async deleteById(id: string): Promise<void> {
    const idx = this.items.findIndex((item) => item.id.toString() === id)

    this.items.splice(idx, 1)
  }
}
