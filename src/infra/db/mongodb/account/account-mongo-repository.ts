import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { AddAcountRepository } from '@/data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository'
import { AccountModel } from '@/domain/models/account'
import { AddAccountModel } from '@/domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAcountRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository {
  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({ _id: id }, {
      $set: {
        accessToken: token
      }
    })
  }

  async loadAccountByEmail (email: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return account && MongoHelper.map(account)
  }

  async loadAccountByToken (token: string, role?: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ accessToken: token, $or: [{ role }, { role: 'admin' }] })
    return account && MongoHelper.map(account)
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const accountData = await (await accountCollection).insertOne(account)
      .then(async data => {
        return await (await accountCollection).findOne(data.insertedId)
      })
    return MongoHelper.map(accountData)
  }
}
