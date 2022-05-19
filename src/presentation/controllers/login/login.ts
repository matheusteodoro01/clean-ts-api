import { Authentication } from '../../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
  constructor (private readonly emailValidator: EmailValidator, private readonly authentication: Authentication) {

  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body

      if (!email) {
        return await Promise.resolve(badRequest(new MissingParamError('email')))
      }

      const isValid = await this.emailValidator.isValid(email)

      if (!isValid) {
        return await Promise.resolve(badRequest(new InvalidParamError('email')))
      }

      await this.authentication.auth(email, password)

      return await Promise.resolve(badRequest(new MissingParamError('password')))
    } catch (error) {
      return serverError(new Error())
    }
  }
}
