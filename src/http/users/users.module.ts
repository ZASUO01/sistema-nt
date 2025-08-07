import { CryptographyModule } from '@/cryptography/cryptography.module'
import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { AuthenticateUserUseCase } from '@/domain/users/application/use-cases/authenticate-user'

@Module({
  imports: [CryptographyModule],
  controllers: [AuthenticateController],
  providers: [AuthenticateUserUseCase],
})
export class UsersModule {}
