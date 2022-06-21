import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeDbAuthetication } from '../usecases/authentication/db-authentication-factory'
import { makeDbAddAccount } from '../usecases/add-account/db-account-factory'
import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthetication())
  return makeLogControllerDecorator(controller)
}
