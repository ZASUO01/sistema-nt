import { WatchedList } from '@/domain/core/entities/watched-list'
import { UserAccess } from './user-access'

export class UserAccessesList extends WatchedList<UserAccess> {
  compareItems(a: UserAccess, b: UserAccess): boolean {
    return a.id.equals(b.id)
  }
}
