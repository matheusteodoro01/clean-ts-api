import { badRequest, ok, serverError } from '../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, AddAccount, Validation, Authentication } from './signup-controller-protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication) {

  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const erro = this.validation.validate(httpRequest.body)
      if (erro) {
        return badRequest(erro)
      }
      const { name, email, password } = httpRequest.body

      await this.addAccount.add({
        name,
        email,
        password
      })
      const acessToken = await this.authentication.auth({ email, password })
      return ok({ acessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
