
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { DbAddSuvery } from './db-add-survey'
import MockDate from 'mockdate'
import { mockSurveyParams, throwError } from '@/domain/test'
import { mockAddSurveyRepository } from '@/data/test'
type SutTypes = {
  sut: DbAddSuvery
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository()
  const sut = new DbAddSuvery(addSurveyRepositoryStub)
  return { sut, addSurveyRepositoryStub }
}

describe('DbAddSurvey UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const makeAddSurveyRepositorySpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyData = mockSurveyParams()
    await sut.add(surveyData)
    expect(makeAddSurveyRepositorySpy).toHaveBeenCalledWith(surveyData)
  })

  test('Should throws if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementation(throwError)
    const surveyData = mockSurveyParams()
    const promise = sut.add(surveyData)
    await expect(promise).rejects.toThrow()
  })
})
