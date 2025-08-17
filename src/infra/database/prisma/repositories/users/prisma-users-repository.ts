import { PaginationParams } from '@/domain/core/repositories/pagination-params'
import { UsersRepository } from '@/domain/users/application/repositories/users-repository'
import { User } from '@/domain/users/enterprise/entities/user'
import { PrismaService } from '../../prisma.service'
import { PrismaUserMapper } from '../../mappers/users/prisma-user-mapper'

export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async findById(id: string): Promise<User | null> {
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

  async findMany(params: PaginationParams): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      skip: (params.page - 1) * params.take,
      take: params.take,
    })

    return users.map(PrismaUserMapper.toDomain)
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user)
    await this.prisma.user.create({ data })
  }

  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user)
    await this.prisma.user.update({
      where: {
        id: user.id.toString(),
      },
      data,
    })
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id,
      },
    })
  }
}
