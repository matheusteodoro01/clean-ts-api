import { Authentication, Controller, HttpRequest, HttpResponse } from './login-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unthorized } from '../../helpers/http-helper'

import { EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
  constructor (private readonly emailValidator: EmailValidator, private readonly authentication: Authentication) {

  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password } = httpRequest.body

      const isValid = await this.emailValidator.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const token = await this.authentication.auth(email, password)
      if (!token) {
        return unthorized()
      }

      return ok({ acessToken: token })
    } catch (error) {
      return serverError(new Error())
    }
  }
}
