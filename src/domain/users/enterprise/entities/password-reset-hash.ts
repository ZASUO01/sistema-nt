import { Entity } from '@/domain/core/entities/entity'
import { UniqueEntityId } from '@/domain/core/entities/unique-entity-id'
import { Optional } from '@/domain/core/types/optional'
import crypto from 'node:crypto'

interface PasswordResetHashProps {
  createdAt: Date
  expiresAt: Date
  userId: UniqueEntityId
  isValid: boolean
}

export class PasswordResetHash extends Entity<PasswordResetHashProps> {
  static readonly EXPIRATION_IN_MILISECONDS = 1000 * 60 * 15
  static readonly REQUEST_COOLDOWN_IN_MILISECONDS = 1000 * 60 * 2

  private _value: string
  private _hash: string | null

  get value() {
    return this._value
  }

  get hash() {
    return this._hash ?? ''
  }

  set hash(newHash: string) {
    this._hash = newHash
  }

  get userId() {
    return this.props.userId
  }

  get expiresAt() {
    return this.props.expiresAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  get isValid() {
    return this.props.isValid
  }

  invalidate() {
    this.props.isValid = false
  }

  private constructor(
    props: PasswordResetHashProps,
    hash?: string,
    id?: UniqueEntityId,
  ) {
    super(props, id)
    this._hash = hash ?? null

    const randomPart = crypto.randomBytes(32).toString('hex')
    const expirationPart = props.expiresAt.getTime().toString()
    const rawValue = `${randomPart}:${expirationPart}:${props.userId}`

    this._value = Buffer.from(rawValue).toString('base64url')
  }

  static createFromHash(
    props: Optional<
      PasswordResetHashProps,
      'createdAt' | 'expiresAt' | 'isValid'
    >,
    hash: string,
    id?: UniqueEntityId,
  ) {
    return new PasswordResetHash(
      {
        createdAt: props.createdAt ?? new Date(),
        expiresAt:
          props.expiresAt ??
          new Date(Date.now() + PasswordResetHash.EXPIRATION_IN_MILISECONDS),
        isValid: props.isValid ?? true,
        ...props,
      },
      hash,
      id,
    )
  }

  static create(
    props: Optional<
      PasswordResetHashProps,
      'createdAt' | 'expiresAt' | 'isValid'
    >,
    id?: UniqueEntityId,
  ) {
    return new PasswordResetHash(
      {
        createdAt: props.createdAt ?? new Date(),
        expiresAt:
          props.expiresAt ??
          new Date(Date.now() + PasswordResetHash.EXPIRATION_IN_MILISECONDS),
        isValid: props.isValid ?? true,
        ...props,
      },
      undefined,
      id,
    )
  }
}
