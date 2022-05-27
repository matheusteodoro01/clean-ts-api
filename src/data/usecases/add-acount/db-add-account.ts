
import { AddAccount, AddAccountModel, AccountModel, Hasher } from '../../../data/usecases/add-acount/db-add-account-protocols'
import { AddAcountRepository } from '../../protocols/db/add-account-repository'

export class DbAddAccount implements AddAccount {
  private readonly hasher: Hasher
  private readonly addAcountRepository: AddAcountRepository
  constructor (hasher: Hasher, addAcountRepository: AddAcountRepository) {
    this.hasher = hasher
    this.addAcountRepository = addAcountRepository
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(account.password)

    const accountData = await this.addAcountRepository.add(Object.assign({}, account, { password: hashedPassword }))

    return accountData
  }
}
