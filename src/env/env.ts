import z from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().optional().default(3333),
  JWT_PUBLIC_KEY: z.string(),
  JWT_PRIVATE_KEY: z.string(),
})

export function validateEnv(env: Record<string, unknown>) {
  return envSchema.parse(env)
}

export type Env = z.infer<typeof envSchema>
