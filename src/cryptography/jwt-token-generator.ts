import {
  TokenGenerator,
  TokenType,
} from '@/domain/users/application/cryptography/token-generator'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JwtTokenGenerator implements TokenGenerator {
  private ACCESS_TOKEN_EXPIRATION = 60 * 15 // 15 mins
  private REFRESH_TOKEN_EXPIRATION = 60 * 60 * 24 * 2 // 2 days

  constructor(private jwtService: JwtService) {}

  async generate(payload: Record<string, unknown>, type: TokenType) {
    switch (type) {
      case 'ACCESS':
        return this.jwtService.signAsync(payload, {
          expiresIn: this.ACCESS_TOKEN_EXPIRATION,
        })

      case 'REFRESH':
        return this.jwtService.signAsync(payload, {
          expiresIn: this.REFRESH_TOKEN_EXPIRATION,
        })
      default:
        return this.jwtService.signAsync(payload, {
          expiresIn: this.ACCESS_TOKEN_EXPIRATION,
        })
    }
  }
}
