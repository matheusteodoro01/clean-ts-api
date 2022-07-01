import {
  forbidden,
  serverError,
  AccessDeniedError,
  HttpRequest, HttpResponse,
  LoadAccountByToken,
  Middleware,
  ok
} from './auth-middleware-protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (!accessToken) {
        return forbidden(new AccessDeniedError())
      }
      const account = await this.loadAccountByToken.load(accessToken, this.role)
      if (account) { return ok({ accountId: account.id }) }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(new Error(error))
    }
  }
}
