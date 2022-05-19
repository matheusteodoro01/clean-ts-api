import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {

  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email } = httpRequest.body

      if (!email) {
        return await Promise.resolve(badRequest(new MissingParamError('email')))
      }

      const isValid = await this.emailValidator.isValid(email)

      if (!isValid) {
        return await Promise.resolve(badRequest(new InvalidParamError('email')))
      }

      return await Promise.resolve(badRequest(new MissingParamError('password')))
    } catch (error) {
      return serverError(new Error())
    }
  }
}
