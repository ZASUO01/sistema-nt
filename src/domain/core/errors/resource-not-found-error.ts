export class ResourceNotFoundError extends Error {
  constructor(key: string) {
    super(`record with key "${key}" not found`)
  }
}
