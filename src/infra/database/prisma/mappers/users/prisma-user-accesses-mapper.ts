import { UniqueEntityId } from '@/domain/core/entities/unique-entity-id'
import { UserAccess } from '@/domain/users/enterprise/entities/user-access'
import { Prisma, UserAccess as PrismaUserAccess } from '@prisma/client'

export class PrismaUserAccessMapper {
  static toDomain(raw: PrismaUserAccess): UserAccess {
    return UserAccess.create(
      {
        userId: new UniqueEntityId(raw.userId),
        appCode: raw.appCode,
        appLevel: raw.appLevel,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(
    userAccess: UserAccess,
  ): Prisma.UserAccessUncheckedCreateInput {
    return {
      id: userAccess.id.toString(),
      userId: userAccess.userId.toString(),
      appCode: userAccess.appCode,
      appLevel: userAccess.appLevel,
    }
  }
}
