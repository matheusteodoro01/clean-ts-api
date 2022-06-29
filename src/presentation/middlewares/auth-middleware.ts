import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors/access-denied'
import { forbidden, ok } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middleware'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    const account = await this.loadAccountByToken.load(accessToken)
    if (account) { return ok({ accountId: account.id }) }
    if (!accessToken) {
      const httpResponse = forbidden(new AccessDeniedError())
      return httpResponse
    }
  }
}
