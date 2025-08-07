import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { UsersRepository } from '@/domain/users/application/repositories/users-repository'
import { PrismaUsersRepository } from './prisma/repositories/users/prisma-users-repository'

@Global()
@Module({
  providers: [
    PrismaService,
    { provide: UsersRepository, useClass: PrismaUsersRepository },
  ],
  exports: [PrismaService, UsersRepository],
})
export class DatabaseModule {}
