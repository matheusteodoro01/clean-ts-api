import { AccessDeniedError } from '../errors/access-denied'
import { forbidden } from '../helpers/http/http-helper'
import { HttpRequest } from '../protocols'
import { Middleware } from '../protocols/middleware'
import { AuthMiddleware } from './auth-middleware'

const makeSut = (): Middleware => new AuthMiddleware()

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const sut = makeSut()
    const httpRequest: HttpRequest = {
      headers: { }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
