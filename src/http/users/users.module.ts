import { CryptographyModule } from '@/cryptography/cryptography.module'
import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { AuthenticateUserUseCase } from '@/domain/users/application/use-cases/authenticate-user'
import { RefreshController } from './controllers/refresh.controller'

@Module({
  imports: [CryptographyModule],
  controllers: [AuthenticateController, RefreshController],
  providers: [AuthenticateUserUseCase],
})
export class UsersModule {}
