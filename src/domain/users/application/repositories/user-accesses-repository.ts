import { UserAccess } from '../../enterprise/entities/user-access'

export abstract class UserAccessesRepository {
  abstract findManyByUserId(userId: string): Promise<UserAccess[]>
  abstract createMany(userAccesses: UserAccess[]): Promise<void>
  abstract deleteMany(userAccesses: UserAccess[]): Promise<void>
  abstract deleteManyByUserId(userId: string): Promise<void>
}
