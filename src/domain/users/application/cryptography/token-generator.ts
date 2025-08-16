import {
  Token,
  TokenProps,
} from '../../enterprise/entities/value-objects/token'

export abstract class TokenGenerator {
  abstract sign(props: TokenProps): Promise<Token>
}
