import { PaginationParams } from '@/domain/core/repositories/pagination-params'
import { User } from '../../enterprise/entities/user'

export abstract class UsersRepository {
  abstract findByEmail(email: string): Promise<User | null>
  abstract findById(id: string): Promise<User | null>
  abstract findMany(params: PaginationParams): Promise<User[]>
  abstract create(user: User): Promise<void>
  abstract save(user: User): Promise<void>
  abstract deleteById(id: string): Promise<void>
}
