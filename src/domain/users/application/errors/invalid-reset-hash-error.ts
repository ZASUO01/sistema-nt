export class InvalidResetHashError extends Error {
  constructor(cause: string) {
    super(`cannot reset password: ${cause}`)
  }
}
