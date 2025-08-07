import { BlockeUserError } from '@/domain/users/application/errors/blocked-user-error'
import { InvalidCredentialsError } from '@/domain/users/application/errors/invalid-credentials-error'
import { AuthenticateUserUseCase } from '@/domain/users/application/use-cases/authenticate-user'
import { ZodValidationPipe } from '@/http/pipes/zod-validation-pipe'
import {
  Controller,
  UsePipes,
  Post,
  Body,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  Version,
  Res,
  HttpCode,
} from '@nestjs/common'
import { Response } from 'express'
import z from 'zod'

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/users/login')
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  @HttpCode(200)
  @Version('1')
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(
    @Res({ passthrough: true }) res: Response,
    @Body() body: AuthenticateBodySchema,
  ) {
    const { email, password } = body

    const result = await this.authenticateUser.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException(error.message)
        case BlockeUserError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken, refreshToken } = result.value

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/api',
      maxAge: 60 * 60 * 24 * 2, // 2 days
    })

    return {
      access_token: accessToken,
    }
  }
}
