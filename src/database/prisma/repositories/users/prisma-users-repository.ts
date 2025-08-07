import { UsersRepository } from '@/domain/users/application/repositories/users-repository'
import { PrismaService } from '../../prisma.service'
import { PrismaUserMapper } from '../../mappers/users/prisma-user-mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }
}
