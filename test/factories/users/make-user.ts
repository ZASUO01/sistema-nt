import { PrismaUserMapper } from '@/database/prisma/mappers/users/prisma-user-mapper'
import { PrismaService } from '@/database/prisma/prisma.service'
import { UniqueEntityID } from '@/domain/core/entities/unique-entity-id'
import { User, UserProps } from '@/domain/users/enterprise/entities/user'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const user = User.create(
    {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password_hash: faker.internet.password(),
      level: 'DEFAULT',
      status: 'ACTIVE',
      createdAt: new Date(),
      ...override,
    },
    id,
  )

  return user
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}) {
    const user = makeUser(data)

    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    })

    return user
  }
}
