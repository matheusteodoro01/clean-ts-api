import { Authentication, Controller, HttpRequest, HttpResponse, Validation } from './login-protocols'
import { badRequest, ok, serverError, unthorized } from '../../helpers/http-helper'

export class LoginController implements Controller {
  constructor (private readonly validation: Validation, private readonly authentication: Authentication) {

  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const erro = this.validation.validate(httpRequest.body)
      if (erro) {
        return badRequest(erro)
      }
      const { email, password } = httpRequest.body

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
