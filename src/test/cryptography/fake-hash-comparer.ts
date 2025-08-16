import { HashComparer } from '@/domain/users/application/cryptography/hash-comparer'

export class FakeHashComparer implements HashComparer {
  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
