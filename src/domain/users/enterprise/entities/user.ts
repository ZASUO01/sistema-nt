import { Entity } from '@/domain/core/entities/entity'
import { UniqueEntityID } from '@/domain/core/entities/unique-entity-id'
import { Optional } from '@/domain/core/types/optional'

export interface UserProps {
  email: string
  firstName: string
  lastName: string
  password_hash: string
  nick?: string | null
  phone?: string | null
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED'
  level: 'ADMIN' | 'DEFAULT'
  createdAt: Date
  updatedAt?: Date | null
}

export class User extends Entity<UserProps> {
  get email() {
    return this.props.email
  }

  get firstName() {
    return this.props.firstName
  }

  get lastName() {
    return this.props.lastName
  }

  get password_hash() {
    return this.props.password_hash
  }

  get nick() {
    return this.props.nick
  }

  get phone() {
    return this.props.phone
  }

  get status() {
    return this.props.status
  }

  get level() {
    return this.props.level
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  blocked() {
    return this.props.status === 'BLOCKED'
  }

  static create(
    props: Optional<UserProps, 'createdAt' | 'status' | 'level'>,
    id?: UniqueEntityID,
  ) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        status: props.status ?? 'ACTIVE',
        level: props.level ?? 'DEFAULT',
      },
      id,
    )

    return user
  }
}
