export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`an user with email "${email}" already exists`)
  }
}
