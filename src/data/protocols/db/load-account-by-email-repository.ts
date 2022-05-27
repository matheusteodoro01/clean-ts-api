import { AccountModel } from '../../usecases/add-acount/db-add-account-protocols'

export interface LoadAccountByEmailRepository {
  loadAccountByEmail: (email: string) => Promise<AccountModel| null>
}
