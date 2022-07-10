import { MissingParamError } from '../../../errors'
import { badRequest, ok, serverError, unthorized } from '../../../helpers/http/http-helper'
import { HttpRequest, Authentication, Validation, AuthenticationModel } from './login-protocols'
import { LoginController } from './login-controller'

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return await Promise.resolve('valid_token')
    }
  }
  return new AuthenticationStub()
}

type SutTypes = {
  sut: LoginController
  validationStub: Validation
  authenticationStub: Authentication

}
const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | undefined { return undefined }
  }
  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const authenticationStub = makeAuthenticationStub()
  const sut = new LoginController(validationStub, authenticationStub)

  return { sut, validationStub, authenticationStub }
}

const makeFakeHttpRequest = (): HttpRequest => ({
  body:
 {
   email: 'any_email@mail.com',
   password: 'any_password'
 }
})
describe('Login Controller', () => {
  test('Should retun 500 if Authetication throws ', async () => {
    const { sut, authenticationStub } = makeSut()
    const isValidSpy = jest.spyOn(authenticationStub, 'auth')
    isValidSpy.mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const isValidSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeFakeHttpRequest())
    expect(isValidSpy).toHaveBeenCalledWith({ email: 'any_email@mail.com', password: 'any_password' })
  })
  test('Should retun 401 if invalid credentials are provided ', async () => {
    const { sut, authenticationStub } = makeSut()
    const isAuth = jest.spyOn(authenticationStub, 'auth')
    isAuth.mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(unthorized())
  })

  test('Should retun 200 is valid credentials provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(ok({ acessToken: 'valid_token' }))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const addSPy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)

    expect(addSPy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
