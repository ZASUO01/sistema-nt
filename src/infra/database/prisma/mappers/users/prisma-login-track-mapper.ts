import { UniqueEntityId } from '@/domain/core/entities/unique-entity-id'
import { LoginTrack } from '@/domain/users/enterprise/entities/login-track'
import { Prisma, LoginTrack as PrismaLoginTrack } from '@prisma/client'

export class PrismaLoginTrackMaper {
  static toDomain(raw: PrismaLoginTrack): LoginTrack {
    return LoginTrack.create(
      {
        userId: new UniqueEntityId(raw.userId),
        state: raw.state,
        device: raw.device,
        addr: raw.addr,
        ocurredAt: raw.ocurredAt,
        controlSequence: raw.controlSequence,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(
    loginTrack: LoginTrack,
  ): Prisma.LoginTrackUncheckedCreateInput {
    return {
      id: loginTrack.id.toString(),
      userId: loginTrack.userId.toString(),
      state: loginTrack.state,
      device: loginTrack.device,
      addr: loginTrack.addr,
      ocurredAt: loginTrack.ocurredAt,
      controlSequence: loginTrack.controlSequence,
    }
  }
}
