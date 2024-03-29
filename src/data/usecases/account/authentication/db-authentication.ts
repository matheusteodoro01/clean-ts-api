import { Authentication, AuthenticationParams, LoadAccountByEmailRepository, HashComparer, Encrypter, UpdateAccessTokenRepository } from './db-authentication-protocols'

export class DbAuthetication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authentication: AuthenticationParams): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.loadAccountByEmail(authentication.email)
    if (!account) { return await Promise.resolve(null) }
    const compare = await this.hashCompare.compare(authentication.password, account.password)
    if (!compare) {
      return await Promise.resolve(null)
    }
    const token = await this.encrypter.encrypt(account.id)
    await this.updateAccessTokenRepository.updateAccessToken(account.id, token)
    return token
  }
}
