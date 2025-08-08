import { UsersRepository } from '@/domain/users/application/repositories/users-repository'
import { PrismaService } from '../../prisma.service'
import { PrismaUserMapper } from '../../mappers/users/prisma-user-mapper'
import { Injectable } from '@nestjs/common'
import { User } from '@/domain/users/enterprise/entities/user'

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

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async create(user: User) {
    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    })
  }

  async save(user: User) {
    await this.prisma.user.update({
      data: PrismaUserMapper.toPrisma(user),
      where: {
        id: user.id.toString(),
      },
    })
  }

  async deleteById(id: string) {
    await this.prisma.user.delete({
      where: {
        id,
      },
    })
  }
}
