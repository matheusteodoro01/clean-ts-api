import { badRequest } from '../../../helpers/http/http-helper'
import { AddSurveyController } from './add-survey-controller'
import { HttpRequest, Validation } from './add-survey-protocols'

interface sutTypes {
  sut: AddSurveyController
  validationStub: Validation
}
const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_version',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }
})

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}
const makeSut = (): sutTypes => {
  const validationStub = makeValidationStub()
  const sut = new AddSurveyController(validationStub)
  return { validationStub, sut }
}
describe('AddSurveyController', () => {
  test('Should call Validation with correct values ', async () => {
    const { sut, validationStub } = makeSut()
    const httpRequest = makeFakeRequest()
    const validationStubSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(httpRequest)
    expect(validationStubSpy).toBeCalledWith(httpRequest.body)
  })
  test('Should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest.spyOn(validationStub, 'validate').mockReturnValue(new Error())
    const HttpResponse = await sut.handle(httpRequest)
    expect(HttpResponse).toEqual(badRequest(new Error()))
  })
})
