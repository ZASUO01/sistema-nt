import { Entity } from '@/domain/core/entities/entity'
import { UniqueEntityID } from '@/domain/core/entities/unique-entity-id'
import { Optional } from '@/domain/core/types/optional'

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED'
export type UserLevel = 'ADMIN' | 'DEFAULT'

export interface UserProps {
  email: string
  firstName: string
  lastName: string
  passwordHash: string
  nick?: string | null
  phone?: string | null
  status: UserStatus
  level: UserLevel
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

  set firstName(firstName: string) {
    this.props.firstName = firstName
  }

  get lastName() {
    return this.props.lastName
  }

  set lastName(lastName: string) {
    this.props.lastName = lastName
  }

  get passwordHash() {
    return this.props.passwordHash
  }

  set passwordHash(passwordHash: string) {
    this.props.passwordHash = passwordHash
  }

  get nick() {
    return this.props.nick
  }

  set nick(nick: string | null | undefined) {
    this.props.nick = nick
  }

  get phone() {
    return this.props.phone
  }

  set phone(phone: string | null | undefined) {
    this.props.phone = phone
  }

  get status() {
    return this.props.status
  }

  set status(newStatus: UserStatus) {
    this.props.status = newStatus
  }

  get level() {
    return this.props.level
  }

  set level(newLevel: UserLevel) {
    this.props.level = newLevel
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set updatedAt(updatedAt: Date | null | undefined) {
    this.props.updatedAt = updatedAt
  }

  isActive() {
    return this.props.status === 'ACTIVE'
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
