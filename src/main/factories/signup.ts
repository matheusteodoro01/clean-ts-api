import { DbAddAccount } from '../../data/usecases/add-acount/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../ultils/email-validator-adpter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogControllerDecorator } from '../decorators/log'

import { LogErrorRepository } from '../../data/protocols/log-error-repository'

class LogErrorRepositoryIMp implements LogErrorRepository {log: (stack: string) => Promise<void> }

export const makeSignUpController = (): LogControllerDecorator => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount)
  const logErrorRepository = new LogErrorRepositoryIMp()
  return new LogControllerDecorator(signUpController, logErrorRepository)
}
