import { Entity } from '@/domain/core/entities/entity'
import { UniqueEntityId } from '@/domain/core/entities/unique-entity-id'

type AppCode = 'FINANCE' | 'STOREROOM'
type AppLevel = 'READ' | 'ADDCHANGE' | 'DELETE'

export interface UserAccessDetail {
  appCode: AppCode
  appLevel: AppLevel
}

interface UserAccessProps {
  userId: UniqueEntityId
  appCode: AppCode
  appLevel: AppLevel
}

export class UserAccess extends Entity<UserAccessProps> {
  get userId() {
    return this.props.userId
  }

  static create(props: UserAccessProps, id?: UniqueEntityId) {
    return new UserAccess(props, id)
  }
}
