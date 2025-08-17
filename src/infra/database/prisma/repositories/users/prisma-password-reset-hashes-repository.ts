import { PasswordResetHashesRepository } from '@/domain/users/application/repositories/password-reset-hashes-repository'
import { PasswordResetHash } from '@/domain/users/enterprise/entities/password-reset-hash'
import { PrismaService } from '../../prisma.service'
import { PrismaPasswordResetHashMapper } from '../../mappers/users/prisma-password-rese-hash-mapper'

export class PrismaPasswordResetHashesRepository
  implements PasswordResetHashesRepository
{
  constructor(private prisma: PrismaService) {}

  async findLastByUserId(userId: string): Promise<PasswordResetHash | null> {
    const hashes = await this.prisma.passwordResetHash.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    })

    if (hashes.length > 0) {
      return PrismaPasswordResetHashMapper.toDomain(hashes[0])
    }

    return null
  }

  async findManyRecentByUserId(userId: string): Promise<PasswordResetHash[]> {
    const hashes = await this.prisma.passwordResetHash.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return hashes.map(PrismaPasswordResetHashMapper.toDomain)
  }

  async create(passwordResetHash: PasswordResetHash): Promise<void> {
    const data = PrismaPasswordResetHashMapper.toPrisma(passwordResetHash)

    await this.prisma.passwordResetHash.create({
      data,
    })
  }

  async save(passwordResetHash: PasswordResetHash): Promise<void> {
    const data = PrismaPasswordResetHashMapper.toPrisma(passwordResetHash)

    await this.prisma.passwordResetHash.update({
      where: {
        id: passwordResetHash.id.toString(),
      },
      data,
    })
  }

  async deleteManyByUserId(userId: string): Promise<void> {
    await this.prisma.passwordResetHash.deleteMany({
      where: {
        userId,
      },
    })
  }
}
