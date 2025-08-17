import { UniqueEntityId } from '@/domain/core/entities/unique-entity-id'
import { PasswordResetHash } from '@/domain/users/enterprise/entities/password-reset-hash'
import {
  Prisma,
  PasswordResetHash as PrismaPasswordResetHash,
} from '@prisma/client'

export class PrismaPasswordResetHashMapper {
  static toDomain(raw: PrismaPasswordResetHash): PasswordResetHash {
    return PasswordResetHash.createFromHash(
      {
        createdAt: raw.createdAt,
        expiresAt: raw.expiresAt,
        userId: new UniqueEntityId(raw.userId),
        isValid: raw.isValid,
      },
      raw.hash,
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(
    passwordResetHash: PasswordResetHash,
  ): Prisma.PasswordResetHashUncheckedCreateInput {
    return {
      id: passwordResetHash.id.toString(),
      userId: passwordResetHash.userId.toString(),
      createdAt: passwordResetHash.createdAt,
      expiresAt: passwordResetHash.expiresAt,
      isValid: passwordResetHash.isValid,
      hash: passwordResetHash.hash,
    }
  }
}
