import { HashGenerator } from '@/domain/users/application/cryptography/hash-generator'
import { Module } from '@nestjs/common'
import { BcryptHashGenerator } from './bcrypt-hash-generator'
import { HashComparer } from '@/domain/users/application/cryptography/hash-comparer'
import { BcryptHashComparer } from './bcrypt-hash-comparer'
import { TokenGenerator } from '@/domain/users/application/cryptography/token-generator'
import { JwtTokenGenerator } from './jwt-token-generator'

@Module({
  providers: [
    { provide: HashGenerator, useClass: BcryptHashGenerator },
    {
      provide: HashComparer,
      useClass: BcryptHashComparer,
    },
    {
      provide: TokenGenerator,
      useClass: JwtTokenGenerator,
    },
  ],
  exports: [HashGenerator, HashComparer, TokenGenerator],
})
export class CryptographyModule {}
