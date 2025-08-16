import { PasswordResetHash } from '../../enterprise/entities/password-reset-hash'

export abstract class PasswordResetHashesRepository {
  abstract findLastByUserId(userId: string): Promise<PasswordResetHash | null>
  abstract findManyRecentByUserId(userId: string): Promise<PasswordResetHash[]>
  abstract create(passwordResetHash: PasswordResetHash): Promise<void>
  abstract save(passwordResetHash: PasswordResetHash): Promise<void>
  abstract deleteManyByUserId(userId: string): Promise<void>
}
