import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { envSchema } from '@/env/env'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'

const env = envSchema.parse(process.env)

const prisma = new PrismaClient()

function generateUniqueDatabaseUrl(schemaId: string) {
  const url = new URL(env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const schemaId = randomUUID()

beforeAll(() => {
  const databaseUrl = generateUniqueDatabaseUrl(schemaId)
  process.env.DATABASE_URL = databaseUrl

  execSync('yarn prisma db push')
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
