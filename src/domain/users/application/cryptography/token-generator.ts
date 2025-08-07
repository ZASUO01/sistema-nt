export type TokenType = 'ACCESS' | 'REFRESH'

export abstract class TokenGenerator {
  abstract generate(
    payload: Record<string, unknown>,
    type: TokenType,
  ): Promise<string>
}
