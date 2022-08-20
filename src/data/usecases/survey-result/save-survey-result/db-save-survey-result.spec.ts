
import MockDate from 'mockdate'
import { SaveSurveyResultRepository } from './db-save-survey-result-protocols'
import { DbSaveSuveryResult } from './db-save-survey-result'
import { mockSurveyResultModel, mockSurveyResultParams, throwError } from '@/domain/test'
import { mockSaveResultSurveySurveyRepository } from '@/data/test'

type SutTypes = {
  sut: DbSaveSuveryResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveResultSurveySurveyRepository()
  const sut = new DbSaveSuveryResult(saveSurveyResultRepositoryStub)
  return { sut, saveSurveyResultRepositoryStub }
}

describe('DbSaveSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const makeSaveResultSurveySurveyRepositorySpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    const surveyResultData = mockSurveyResultParams()
    await sut.save(surveyResultData)
    expect(makeSaveResultSurveySurveyRepositorySpy).toHaveBeenCalledWith(surveyResultData)
  })
  test('Should return survey of Survey on success', async () => {
    const { sut } = makeSut()
    const surveyResultData = mockSurveyResultParams()
    const surveyResult = await sut.save(surveyResultData)
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })

  test('Should throws if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementation(throwError)
    const surveyResultData = mockSurveyResultParams()
    const promise = sut.save(surveyResultData)
    await expect(promise).rejects.toThrow()
  })
})
