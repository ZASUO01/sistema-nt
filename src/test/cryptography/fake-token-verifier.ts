import { TokenVerifier } from '@/domain/users/application/cryptography/token-verifier'

export class FakeTokenVerifier implements TokenVerifier {
  async verify(value: string): Promise<boolean> {
    return value.includes('REFRESH') || value.includes('ACCESS')
  }
}
