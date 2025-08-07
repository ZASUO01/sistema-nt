import { UniqueEntityID } from '@/domain/core/entities/unique-entity-id'
import { User } from '@/domain/users/enterprise/entities/user'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        email: raw.email,
        firstName: raw.firstName,
        lastName: raw.lastName,
        password_hash: raw.password_hash,
        nick: raw.nick,
        phone: raw.phone,
        level: raw.level,
        status: raw.status,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password_hash: user.password_hash,
      nick: user.nick,
      phone: user.phone,
      status: user.status,
      level: user.level,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
