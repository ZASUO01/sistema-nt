import { TokenGenerator } from '@/domain/users/application/cryptography/token-generator'
import {
  Token,
  TokenProps,
} from '@/domain/users/enterprise/entities/value-objects/token'

export class FakeTokenGenerator implements TokenGenerator {
  async sign(props: TokenProps): Promise<Token> {
    const token = Token.create(props)
    token.value = JSON.stringify(token.payload).concat(token.type)

    return token
  }
}
