export class BlockeUserError extends Error {
  constructor() {
    super(`this user is blocked`)
  }
}
