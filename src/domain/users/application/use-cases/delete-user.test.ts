import { InMemoryLoginTracksRepository } from '@/test/repositories/users/in-memory-login-tracks-repository'
import { InMemoryPasswordResetHashesRepository } from '@/test/repositories/users/in-memory-password-reset-hashes-repository'
import { InMemoryUserAccessesRepository } from '@/test/repositories/users/in-memory-user-accesses-repository'
import { InMemoryUsersRepository } from '@/test/repositories/users/in-memory-users-repository'
import { DeleteUserUseCase } from './delete-user'
import { User } from '../../enterprise/entities/user'
import { makeUser } from '@/test/factories/users/make-user'
import { makeLoginTrack } from '@/test/factories/users/make-login-track'
import { UserAccess } from '../../enterprise/entities/user-access'
import { PasswordResetHash } from '../../enterprise/entities/password-reset-hash'
import { ResourceNotFoundError } from '@/domain/core/errors/resource-not-found-error'

describe('(UNIT) Delete User', async () => {
  let usersRepository: InMemoryUsersRepository
  let userAcessesRepository: InMemoryUserAccessesRepository
  let loginTracksRepository: InMemoryLoginTracksRepository
  let passwordResetHashesRepository: InMemoryPasswordResetHashesRepository
  let sut: DeleteUserUseCase
  let user: User

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    userAcessesRepository = new InMemoryUserAccessesRepository()
    loginTracksRepository = new InMemoryLoginTracksRepository()
    passwordResetHashesRepository = new InMemoryPasswordResetHashesRepository()
    sut = new DeleteUserUseCase(
      usersRepository,
      loginTracksRepository,
      userAcessesRepository,
      passwordResetHashesRepository,
    )

    user = makeUser()
    await usersRepository.create(user)

    await loginTracksRepository.create(makeLoginTrack({ userId: user.id }))
    await userAcessesRepository.createMany([
      UserAccess.create({
        userId: user.id,
        appCode: 'FINANCE',
        appLevel: 'READ',
      }),
    ])
    await passwordResetHashesRepository.create(
      PasswordResetHash.create({ userId: user.id }),
    )
  })

  it('should be able to delete an user and associated records', async () => {
    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(usersRepository.items).toHaveLength(0)
    expect(loginTracksRepository.items).toHaveLength(0)
    expect(userAcessesRepository.items).toHaveLength(0)
    expect(passwordResetHashesRepository.items).toHaveLength(0)
  })

  it('should not be able to delete invalid user', async () => {
    const result = await sut.execute({
      userId: 'invalid-user',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
