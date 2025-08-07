import { HashGenerator } from '@/domain/users/application/cryptography/hash-generator'

export class FakeHashGenerator implements HashGenerator {
  async hash(plain: string) {
    return plain.concat('-hashed')
  }
}
