import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import { AccountModel } from '@/domain/models/account'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly descrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository) {

  }

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    const token = await this.descrypter.decrypt(accessToken)
    if (token) {
      const account = await this.loadAccountByTokenRepository.loadAccountByToken(accessToken, role)
      return account
    }

    return await Promise.resolve(null)
  }
}
