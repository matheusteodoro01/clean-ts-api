import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { DbLoadSurveys } from './db-load-surveys'
import MockDate from 'mockdate'
import { throwError, mockSurveyModel } from '@/domain/test'
import { mockLoadSurveysRepository } from '@/data/test'
type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
  return { sut, loadSurveysRepositoryStub }
}

describe('DbLoadSurveys ', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should LoadSurveysRepository ', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadSurveysRepositorySpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadSurveysRepositorySpy).toHaveBeenCalled()
  })

  test('Should return list of Surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()
    expect(surveys).toEqual([mockSurveyModel()])
  })

  test('Should throw if LoadSurveysRepository trows', async () => {
    const { loadSurveysRepositoryStub, sut } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockImplementation(throwError)
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})
