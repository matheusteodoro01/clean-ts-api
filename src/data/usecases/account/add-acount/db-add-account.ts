
import { AddAccount, AddAccountParams, AccountModel, Hasher } from './db-add-account-protocols'
import { AddAcountRepository } from '@/data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAcountRepository: AddAcountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (account: AddAccountParams): Promise<AccountModel> {
    const accountUser = await this.loadAccountByEmailRepository.loadAccountByEmail(account.email)
    if (accountUser) { return null }
    const hashedPassword = await this.hasher.hash(account.password)
    const accountData = await this.addAcountRepository.add(Object.assign({}, account, { password: hashedPassword }))
    return accountData
  }
}
