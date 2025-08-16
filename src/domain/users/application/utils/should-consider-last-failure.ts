import { LoginTrack } from '../../enterprise/entities/login-track'

export function shouldConsiderLastFailure(lastLoginTrack: LoginTrack): boolean {
  const now = new Date()
  const fifteenMinutesAgo = new Date(now.getTime() - 1000 * 60 * 15)

  if (
    lastLoginTrack.state === 'FAILURE' &&
    lastLoginTrack.ocurredAt > fifteenMinutesAgo
  ) {
    return true
  }

  return false
}
