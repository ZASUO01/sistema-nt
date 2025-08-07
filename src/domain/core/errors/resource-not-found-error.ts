export class ResourceNotFoundError extends Error {
  constructor(id: string) {
    super(`could not find entity ${id}`)
  }
}
