import { UniqueEntityId } from '@/domain/core/entities/unique-entity-id'
import {
  LoginTrack,
  LoginTrackProps,
} from '@/domain/users/enterprise/entities/login-track'

export function makeLoginTrack(
  override: Partial<LoginTrackProps> = {},
  id?: UniqueEntityId,
) {
  const loginTrack = LoginTrack.create(
    {
      userId: new UniqueEntityId(),
      state: 'SUCCESS',
      ocurredAt: new Date(),
      controlSequence: 0,
      ...override,
    },
    id,
  )

  return loginTrack
}
