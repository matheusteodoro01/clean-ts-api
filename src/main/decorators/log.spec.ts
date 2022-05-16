import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'
interface makeSutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse = {
        body: { name: 'Matheus' },
        statusCode: 200
      }
      return await Promise.resolve(httpResponse)
    }
  }
  return new ControllerStub()
}

const makeSut = (): makeSutTypes => {
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub)
  return { sut, controllerStub }
}
describe('LogControllerDecorator', () => {
  test('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpyOn = jest.spyOn(controllerStub, 'handle')
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
