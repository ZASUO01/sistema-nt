export class UserAlreadyExistsError extends Error{
    constructor(email: string){
        super(`the user with email "${email}" already exists`)
    }
}