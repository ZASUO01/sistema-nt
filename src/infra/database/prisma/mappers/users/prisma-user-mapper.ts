import { UniqueEntityId } from '@/domain/core/entities/unique-entity-id'
import { User } from '@/domain/users/enterprise/entities/user'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        email: raw.email,
        firstName: raw.firstName,
        lastName: raw.lastName,
        passwordHash: raw.passwordHash,
        nick: raw.nick,
        phone: raw.phone,
        status: raw.status,
        level: raw.level,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      passwordHash: user.passwordHash,
      nick: user.nick,
      phone: user.phone,
      status: user.status,
      level: user.level,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
