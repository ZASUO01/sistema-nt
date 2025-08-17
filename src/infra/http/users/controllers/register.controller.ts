import { CreateUserUseCase } from '@/domain/users/application/use-cases/create-user'
import { Body, Controller, Post, UsePipes, Version } from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe'

const registerBodySchema = z.object({
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z
    .string()
    .min(6)
    .max(20)
    .regex(/[0-9]/)
    .regex(/[!@#$%^&*(),.?":{}|<>]/),
  nick: z.string().optional(),
  phone: z.string().optional(),
})

type RegisterBodySchema = z.infer<typeof registerBodySchema>

@Controller('/users')
export class RegisterController {
  constructor(private createUser: CreateUserUseCase) {}

  @Post()
  @Version('1')
  @UsePipes(new ZodValidationPipe(registerBodySchema))
  async handle(@Body() body: RegisterBodySchema) {
    const { email, firstName, lastName, password, nick, phone } = body
  }
}
