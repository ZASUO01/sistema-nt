import { User } from '../../enterprise/entities/user'
import { makeUser } from '@/test/factories/users/make-user'
import { InMemoryUserAccessesRepository } from '@/test/repositories/users/in-memory-user-accesses-repository'
import { FetchUserAccessesUseCase } from './fetch-user-accesses'
import { UserAccess } from '../../enterprise/entities/user-access'
import { UniqueEntityId } from '@/domain/core/entities/unique-entity-id'

describe('(UNIT) Fetch User Accesses', () => {
  let userAccessesRepository: InMemoryUserAccessesRepository
  let sut: FetchUserAccessesUseCase
  let user: User

  beforeEach(async () => {
    userAccessesRepository = new InMemoryUserAccessesRepository()
    sut = new FetchUserAccessesUseCase(userAccessesRepository)

    user = makeUser()
  })

  it('should be able to fetch the user accesses', async () => {
    const list = [
      UserAccess.create({
        userId: user.id,
        appCode: 'FINANCE',
        appLevel: 'ADDCHANGE',
      }),

      UserAccess.create({
        userId: user.id,
        appCode: 'FINANCE',
        appLevel: 'READ',
      }),

      UserAccess.create({
        userId: new UniqueEntityId('other-id'),
        appCode: 'FINANCE',
        appLevel: 'ADDCHANGE',
      }),
    ]

    await userAccessesRepository.createMany(list)

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.userAccesses).toHaveLength(2)
  })
})
