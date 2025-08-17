import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { UsersRepository } from '@/domain/users/application/repositories/users-repository'
import { PrismaUsersRepository } from './prisma/repositories/users/prisma-users-repository'
import { UserAccessesRepository } from '@/domain/users/application/repositories/user-accesses-repository'
import { PrismaUserAccessesRepository } from './prisma/repositories/users/prisma-user-accesses-repository'
import { LoginTracksRepository } from '@/domain/users/application/repositories/login-tracks-repository'
import { PrismaLoginTracksRepository } from './prisma/repositories/users/prisma-login-tracks-repository'
import { PasswordResetHashesRepository } from '@/domain/users/application/repositories/password-reset-hashes-repository'
import { PrismaPasswordResetHashesRepository } from './prisma/repositories/users/prisma-password-reset-hashes-repository'

@Module({
  providers: [
    PrismaService,
    { provide: UsersRepository, useClass: PrismaUsersRepository },
    { provide: UserAccessesRepository, useClass: PrismaUserAccessesRepository },
    { provide: LoginTracksRepository, useClass: PrismaLoginTracksRepository },
    {
      provide: PasswordResetHashesRepository,
      useClass: PrismaPasswordResetHashesRepository,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    UserAccessesRepository,
    LoginTracksRepository,
    PasswordResetHashesRepository,
  ],
})
export class DatabaseModule {}
