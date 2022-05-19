import { DbAddAccount } from '../../data/usecases/add-acount/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../ultils/email-validator-adpter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogControllerDecorator } from '../decorators/log'

import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = (): LogControllerDecorator => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount, makeSignUpValidation())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
