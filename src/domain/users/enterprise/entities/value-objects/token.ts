import { ValueObject } from '@/domain/core/entities/value-object'
import { UserLevel } from '../user'

export interface TokenPayload {
  sub: string
  level: UserLevel
}

type TokenType = 'ACCESS' | 'REFRESH'

export interface TokenProps {
  payload: TokenPayload
  type: TokenType
}

const ACCESS_TOKEN_EXPIRATION = 60 * 15 // 15 mins
const REFRESH_TOKEN_EXPIRATION = 60 * 60 * 24 * 2 // 2 days

export class Token extends ValueObject<TokenProps> {
  private _value: string | null
  private _expiration: number

  get value() {
    return this._value ?? ''
  }

  set value(newValue: string) {
    this._value = newValue
  }

  get payload() {
    return this.props.payload
  }

  get type() {
    return this.props.type
  }

  private constructor(props: TokenProps, value?: string) {
    super(props)
    this._value = value ?? null

    switch (props.type) {
      case 'ACCESS':
        this._expiration = ACCESS_TOKEN_EXPIRATION
        break
      case 'REFRESH':
        this._expiration = REFRESH_TOKEN_EXPIRATION
        break
      default:
        this._expiration = ACCESS_TOKEN_EXPIRATION
    }
  }

  static create(props: TokenProps, value?: string) {
    return new Token(props, value)
  }
}
