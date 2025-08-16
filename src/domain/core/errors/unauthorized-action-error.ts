export class UnauthorizedActionError extends Error {
  constructor() {
    super('not allowed to perform this action')
  }
}
