import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { AccountModel } from '../add-acount/db-add-account-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (private readonly descrypter: Decrypter) {

  }

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    await this.descrypter.decrypt(accessToken)
    return await Promise.resolve({ id: 'any_id', email: 'any_email', name: 'any_name', password: 'any_password' })
  }
}
