import { TokenGenerator } from '@/domain/users/application/cryptography/token-generator'
import { Controller, HttpCode, Post, Res } from '@nestjs/common'
import { Response } from 'express'

@Controller('/users/refresh')
export class RefreshController {
  constructor(private tokenGenerator: TokenGenerator) {}

  @Post()
  @HttpCode(200)
  async handle(@Res({ passthrough: true }) res: Response) {}
}
