import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

describe('LogControllerDecorator', () => {
  test('should call controller handle', async () => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse = {
          body: { name: 'Matheus' },
          statusCode: 200
        }
        return await Promise.resolve(httpResponse)
      }
    }

    const controllerStub = new ControllerStub()
    const handleSpyOn = jest.spyOn(controllerStub, 'handle')
    const sut = new LogControllerDecorator(controllerStub)
    const httpRequest = {
      body: {
        email: '',
        name: '',
        password: '',
        passwordConfirmation: ''
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpyOn).toHaveBeenCalledWith(httpRequest)
  })
})
