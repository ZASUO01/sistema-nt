import {
  TokenGenerator,
  TokenType,
} from '@/domain/users/application/cryptography/token-generator'

export class FakeTokenGenerator implements TokenGenerator {
  async generate(payload: Record<string, unknown>, type: TokenType) {
    if (type === 'ACCESS') {
      return JSON.stringify(payload).concat('-ACCESS')
    }

    return JSON.stringify(payload).concat('-REFRESH')
  }
}
