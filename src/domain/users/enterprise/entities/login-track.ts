import { Entity } from '@/domain/core/entities/entity'
import { UniqueEntityId } from '@/domain/core/entities/unique-entity-id'
import { Optional } from '@/domain/core/types/optional'

type LoginTrackState = 'SUCCESS' | 'FAILURE'

export interface LoginTrackProps {
  userId: UniqueEntityId
  state: LoginTrackState
  device?: string | null
  addr?: string | null
  ocurredAt: Date
  controlSequence: number
}

export class LoginTrack extends Entity<LoginTrackProps> {
  get userId() {
    return this.props.userId
  }

  get state() {
    return this.props.state
  }

  get ocurredAt() {
    return this.props.ocurredAt
  }

  get controlSequence() {
    return this.props.controlSequence
  }

  set controlSequence(newSeq: number) {
    this.props.controlSequence = newSeq
  }

  static create(
    props: Optional<LoginTrackProps, 'state' | 'ocurredAt' | 'controlSequence'>,
    id?: UniqueEntityId,
  ) {
    const loginTrack = new LoginTrack(
      {
        state: props.state ?? 'SUCCESS',
        ocurredAt: props.ocurredAt ?? new Date(),
        controlSequence: props.controlSequence ?? 0,
        ...props,
      },
      id,
    )

    return loginTrack
  }
}
