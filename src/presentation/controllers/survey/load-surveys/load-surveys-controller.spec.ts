
import { LoadSurveysController } from './load-surveys-controller'
import { LoadSurveys, noContent, ok, serverError } from './load-surveys-protocols'
import MockDate from 'mockdate'
import { mockSurveyModel, throwError } from '@/domain/test'
import { mockLoadSurveys } from '@/presentation/test'

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysUseCaseStub: LoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveysUseCaseStub = mockLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysUseCaseStub)
  return { sut, loadSurveysUseCaseStub }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveys', async () => {
    const { sut, loadSurveysUseCaseStub } = makeSut()
    const loadSurveySpy = jest.spyOn(loadSurveysUseCaseStub, 'load')
    await sut.handle({})
    expect(loadSurveySpy).toHaveBeenCalled()
  })

  test('Should 200 on success LoadSurveys', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok([mockSurveyModel()]))
  })

  test('Should 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysUseCaseStub } = makeSut()
    jest.spyOn(loadSurveysUseCaseStub, 'load').mockReturnValueOnce(Promise.resolve([]))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })
  test('Should return 500 if LoadSurveys fails', async () => {
    const { sut, loadSurveysUseCaseStub } = makeSut()
    jest.spyOn(loadSurveysUseCaseStub, 'load').mockImplementation(throwError)
    const HttpResponse = await sut.handle({})
    expect(HttpResponse).toEqual(serverError(new Error()))
  })
})
