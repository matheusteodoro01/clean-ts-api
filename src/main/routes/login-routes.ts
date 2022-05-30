/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'

import { makeSignUpController } from '../factories/singup/signup-factory'
import { makeLoginController } from '../factories/login/login-factory'
import { adaptRoute } from '../adapters/express/express-routes-adapter'
export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
