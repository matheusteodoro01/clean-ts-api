
import { AddAccount, AddAccountModel, AccountModel, Encrypter } from '../../../data/usecases/add-acount/db-add-account-protocols'
import { AddAcountRepository } from '../../protocols/add-account-repository'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAcountRepository: AddAcountRepository
  constructor (encrypter: Encrypter, addAcountRepository: AddAcountRepository) {
    this.encrypter = encrypter
    this.addAcountRepository = addAcountRepository
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password)

    const accountData = await this.addAcountRepository.add(Object.assign({}, account, { password: hashedPassword }))

    return accountData
  }
}
