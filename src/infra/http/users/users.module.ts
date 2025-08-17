import { Module } from '@nestjs/common'
import { RegisterController } from './controllers/register.controller'
import { CreateUserUseCase } from '@/domain/users/application/use-cases/create-user'

@Module({
  controllers: [RegisterController],
  providers: [CreateUserUseCase],
})
export class UsersModule {}
