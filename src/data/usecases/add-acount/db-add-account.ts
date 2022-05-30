
import { AddAccount, AddAccountModel, AccountModel, Hasher } from '../../../data/usecases/add-acount/db-add-account-protocols'
import { AddAcountRepository } from '../../protocols/db/account/add-account-repository'

export class DbAddAccount implements AddAccount {
  constructor (private readonly hasher: Hasher, private readonly addAcountRepository: AddAcountRepository) {

  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(account.password)

    const accountData = await this.addAcountRepository.add(Object.assign({}, account, { password: hashedPassword }))

    return accountData
  }
}
