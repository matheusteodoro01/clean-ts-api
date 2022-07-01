import { AccountModel } from '../../../usecases/add-acount/db-add-account-protocols'

export interface LoadAccountByTokenRepository {
  loadAccountByToken: (token: string, role?: string) => Promise<AccountModel| null>
}
