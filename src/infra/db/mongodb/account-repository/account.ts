import { AddAcountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAcountRepository {
  async add (account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const accountData = await (await accountCollection).insertOne(account)
      .then(async data => {
        return await (await accountCollection).findOne(data.insertedId)
      })
    return MongoHelper.map(accountData)
  }
}
