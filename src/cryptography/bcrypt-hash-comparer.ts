import { HashComparer } from '@/domain/users/application/cryptography/hash-comparer'
import { compare as bcryptCompare } from 'bcryptjs'

export class BcryptHashComparer implements HashComparer {
  async compare(plain: string, hash: string) {
    return await bcryptCompare(plain, hash)
  }
}
