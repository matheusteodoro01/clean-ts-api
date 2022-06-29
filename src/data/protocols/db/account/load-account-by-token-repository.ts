import { AccountModel } from '../../../usecases/add-acount/db-add-account-protocols'

export interface LoadAccountByTokenRepository {
  loadAccountByToken: (token: string) => Promise<AccountModel| null>
}
