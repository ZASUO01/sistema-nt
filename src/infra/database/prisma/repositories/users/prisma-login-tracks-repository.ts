import { PaginationParams } from '@/domain/core/repositories/pagination-params'
import { LoginTracksRepository } from '@/domain/users/application/repositories/login-tracks-repository'
import { LoginTrack } from '@/domain/users/enterprise/entities/login-track'
import { PrismaService } from '../../prisma.service'
import { PrismaLoginTrackMaper } from '../../mappers/users/prisma-login-track-mapper'

export class PrismaLoginTracksRepository implements LoginTracksRepository {
  constructor(private prisma: PrismaService) {}

  async findLastByUserId(userId: string): Promise<LoginTrack | null> {
    const loginTracks = await this.prisma.loginTrack.findMany({
      where: { userId },
      orderBy: {
        ocurredAt: 'desc',
      },
      take: 1,
    })

    if (loginTracks.length > 0) {
      return PrismaLoginTrackMaper.toDomain(loginTracks[0])
    }

    return null
  }

  async findManyByUserId(
    params: PaginationParams,
    userId: string,
    beginAt: Date,
  ): Promise<LoginTrack[]> {
    const loginTracks = await this.prisma.loginTrack.findMany({
      where: {
        AND: {
          userId,
          ocurredAt: {
            gte: beginAt,
          },
        },
      },

      skip: (params.page - 1) * params.take,
      take: params.take,
      orderBy: {
        ocurredAt: 'desc',
      },
    })

    return loginTracks.map(PrismaLoginTrackMaper.toDomain)
  }

  async create(loginTrack: LoginTrack): Promise<void> {
    const data = PrismaLoginTrackMaper.toPrisma(loginTrack)

    await this.prisma.loginTrack.create({ data })
  }

  async save(loginTrack: LoginTrack): Promise<void> {
    const data = PrismaLoginTrackMaper.toPrisma(loginTrack)

    await this.prisma.loginTrack.update({
      where: {
        id: loginTrack.id.toString(),
      },
      data,
    })
  }

  async deleteManyByUserId(userId: string): Promise<void> {
    await this.prisma.loginTrack.deleteMany({
      where: {
        userId,
      },
    })
  }
}
