import { AccessDeniedError } from '../errors/access-denied'
import { forbidden } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middleware'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = forbidden(new AccessDeniedError())
    return httpResponse
  }
}
