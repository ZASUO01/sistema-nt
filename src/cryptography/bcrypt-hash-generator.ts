import { HashGenerator } from '@/domain/users/application/cryptography/hash-generator'
import { hash as bcryptHash } from 'bcryptjs'

export class BcryptHashGenerator implements HashGenerator {
  private HASH_SALT_LENGHT = 8

  async hash(plain: string) {
    return await bcryptHash(plain, this.HASH_SALT_LENGHT)
  }
}
