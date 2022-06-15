
import { AddAccount, AddAccountModel, AccountModel, Hasher } from '../../../data/usecases/add-acount/db-add-account-protocols'
import { AddAcountRepository } from '../../protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../authentication/db-authentication-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAcountRepository: AddAcountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const accountUser = await this.loadAccountByEmailRepository.loadAccountByEmail(account.email)
    if (accountUser) { return null }
    const hashedPassword = await this.hasher.hash(account.password)
    const accountData = await this.addAcountRepository.add(Object.assign({}, account, { password: hashedPassword }))
    return accountData
  }
}
