import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { AccountModel } from '../add-acount/db-add-account-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly descrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository) {

  }

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    const token = await this.descrypter.decrypt(accessToken)
    if (token) {
      const account = await this.loadAccountByTokenRepository.loadAccountByToken(accessToken)
      return account
    }

    return await Promise.resolve(null)
  }
}
