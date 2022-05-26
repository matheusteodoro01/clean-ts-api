import { Authentication, AuthenticationModel, LoadAccountByEmailRepository, HashCompare, TokenGenerator, UpdateAccessTokenRepository } from './db-authentication-protocols'

export class DbAuthetication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (!account) { return await Promise.resolve(null) }
    const compare = this.hashCompare.compare(authentication.password, account.password)
    if (!compare) {
      return await Promise.resolve(null)
    }
    const token = await this.tokenGenerator.generate(account.id)
    await this.updateAccessTokenRepository.update(account.id, token)
    return token
  }
}
