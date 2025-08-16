import { UniqueEntityId } from '@/domain/core/entities/unique-entity-id'
import { User, UserProps } from '@/domain/users/enterprise/entities/user'

import { faker } from '@faker-js/faker'

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityId,
) {
  const user = User.create(
    {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      passwordHash: faker.internet.password(),
      level: 'DEFAULT',
      status: 'ACTIVE',
      createdAt: new Date(),
      ...override,
    },
    id,
  )

  return user
}
