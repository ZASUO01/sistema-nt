import { Entity } from '@/domain/core/entities/entity'
import { UniqueEntityId } from '@/domain/core/entities/unique-entity-id'
import { Optional } from '@/domain/core/types/optional'

type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED'
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

  set firstName(newName: string) {
    this.props.firstName = newName
  }

  get lastName() {
    return this.props.lastName
  }

  set lastName(newName: string) {
    this.props.lastName = newName
  }

  get passwordHash() {
    return this.props.passwordHash
  }

  set passwordHash(newPassword: string) {
    this.props.passwordHash = newPassword
  }

  get nick(): string | null | undefined {
    return this.props.nick
  }

  set nick(newNick: string) {
    this.props.nick = newNick
  }

  get phone(): string | null | undefined {
    return this.props.phone
  }

  set phone(newPhone: string) {
    this.props.phone = newPhone
  }

  get level() {
    return this.props.level
  }

  get status() {
    return this.props.status
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt
  }

  set updatedAt(newDate: Date) {
    this.props.updatedAt = newDate
  }

  isActive() {
    return this.props.status === 'ACTIVE'
  }

  activate() {
    this.props.status = 'ACTIVE'
  }

  isInactive() {
    return this.props.status === 'INACTIVE'
  }

  deactivate() {
    this.props.status = 'INACTIVE'
  }

  isBlocked() {
    return this.props.status === 'BLOCKED'
  }

  block() {
    this.props.status = 'BLOCKED'
  }

  isAdmin() {
    return this.props.level === 'ADMIN'
  }

  promote() {
    this.props.level = 'ADMIN'
  }

  demote() {
    this.props.level = 'DEFAULT'
  }

  static create(
    props: Optional<UserProps, 'status' | 'level' | 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const user = new User(
      {
        status: props.status ?? 'ACTIVE',
        level: props.level ?? 'DEFAULT',
        createdAt: props.createdAt ?? new Date(),
        ...props,
      },
      id,
    )

    return user
  }
}
