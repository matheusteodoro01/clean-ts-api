import { AccountModel } from '@/domain/models/account'
import { mockAccountModel } from '@/domain/test'
import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account'

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel())
    }
  }
  const addAccountStub = new AddAccountStub()
  return addAccountStub
}
