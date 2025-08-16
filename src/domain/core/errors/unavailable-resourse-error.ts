export class UnavailableResourceError extends Error {
  constructor() {
    super('resource unavailable at this time')
  }
}
