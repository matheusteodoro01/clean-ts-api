
import MockDate from 'mockdate'
import { SaveSurveyResultParams, SaveSurveyResultRepository, SurveyResultModel } from './db-save-survey-result-protocols'
import { DbSaveSuveryResult } from './db-save-survey-result'
import { mockSurveyResultModel, mockSurveyResultParams, throwError } from '@/tests'

type SutTypes = {
  sut: DbSaveSuveryResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSaveResultSurveySurveyRepository = (): SaveSurveyResultRepository => {
  class SaveResultSurveySurveyRepositoryStub implements SaveSurveyResultRepository {
    async save (model: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResultModel())
    }
  }
  return new SaveResultSurveySurveyRepositoryStub()
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveResultSurveySurveyRepository()
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
