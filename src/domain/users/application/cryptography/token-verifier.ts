export abstract class TokenVerifier {
  abstract verify(value: string): Promise<boolean>
}
