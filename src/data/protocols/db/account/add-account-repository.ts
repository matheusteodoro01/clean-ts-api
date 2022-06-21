import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'

export interface AddAcountRepository {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
