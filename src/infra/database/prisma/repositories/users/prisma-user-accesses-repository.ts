import { UserAccessesRepository } from '@/domain/users/application/repositories/user-accesses-repository'
import { UserAccess } from '@/domain/users/enterprise/entities/user-access'
import { PrismaService } from '../../prisma.service'
import { PrismaUserAccessMapper } from '../../mappers/users/prisma-user-accesses-mapper'

export class PrismaUserAccessesRepository implements UserAccessesRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByUserId(userId: string): Promise<UserAccess[]> {
    const userAccesses = await this.prisma.userAccess.findMany({
      where: { userId },
    })

    return userAccesses.map(PrismaUserAccessMapper.toDomain)
  }

  async createMany(userAccesses: UserAccess[]): Promise<void> {
    const data = userAccesses.map(PrismaUserAccessMapper.toPrisma)

    await this.prisma.userAccess.createMany({ data })
  }

  async deleteMany(userAccesses: UserAccess[]): Promise<void> {
    const ids = userAccesses.map((userAccess) => userAccess.id.toString())

    await this.prisma.userAccess.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })
  }

  async deleteManyByUserId(userId: string): Promise<void> {
    await this.prisma.userAccess.deleteMany({
      where: {
        userId,
      },
    })
  }
}
