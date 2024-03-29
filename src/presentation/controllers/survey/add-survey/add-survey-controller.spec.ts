import { badRequest, noContent, serverError } from '../../../helpers/http/http-helper'
import { AddSurveyController } from './add-survey-controller'
import { AddSurvey, HttpRequest, Validation } from './add-survey-protocols'
import MockDate from 'mockdate'
import { throwError } from '@/domain/test'
import { mockValidation } from '@/validation/test'
import { mockAddSuvey } from '@/presentation/test'
interface sutTypes {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}
const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_version',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }
})

const makeSut = (): sutTypes => {
  const validationStub = mockValidation()
  const addSurveyStub = mockAddSuvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub)
  return { validationStub, addSurveyStub, sut }
}
describe('AddSurveyController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
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

  test('Should call AddSuveyUseCase with correct values ', async () => {
    const { sut, addSurveyStub } = makeSut()
    const httpRequest = makeFakeRequest()
    const addSurveyStubSpy = jest.spyOn(addSurveyStub, 'add')
    await sut.handle(httpRequest)
    expect(addSurveyStubSpy).toBeCalledWith(httpRequest.body)
  })

  test('Should return 500 if AddSuveyUseCase fails', async () => {
    const { sut, addSurveyStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest.spyOn(addSurveyStub, 'add').mockImplementation(throwError)
    const HttpResponse = await sut.handle(httpRequest)
    expect(HttpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const HttpResponse = await sut.handle(httpRequest)
    expect(HttpResponse).toEqual(noContent())
  })
})
