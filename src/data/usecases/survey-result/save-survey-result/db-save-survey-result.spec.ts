
import MockDate from 'mockdate'
import { SaveSurveyResultParams, SaveSurveyResultRepository, SurveyResultModel } from './db-save-survey-result-protocols'
import { DbSaveSuveryResult } from './db-save-survey-result'

type SutTypes = {
  sut: DbSaveSuveryResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSaveResultSurveySurveyRepository = (): SaveSurveyResultRepository => {
  class SaveResultSurveySurveyRepositoryStub implements SaveSurveyResultRepository {
    async save (model: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await Promise.resolve({ id: 'any_id', ...makeFakeSurveyResultData() })
    }
  }
  return new SaveResultSurveySurveyRepositoryStub()
}

const makeFakeSurveyResultData = (): SaveSurveyResultParams => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  date: new Date()
})

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
    const surveyResultData = makeFakeSurveyResultData()
    await sut.save(surveyResultData)
    expect(makeSaveResultSurveySurveyRepositorySpy).toHaveBeenCalledWith(surveyResultData)
  })
  test('Should return survey of Survey on success', async () => {
    const { sut } = makeSut()
    const surveyResultData = makeFakeSurveyResultData()
    const surveyResult = await sut.save(surveyResultData)
    expect(surveyResult).toEqual({ id: 'any_id', ...makeFakeSurveyResultData() })
  })

  test('Should throws if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(Promise.reject(new Error()))
    const surveyResultData = makeFakeSurveyResultData()
    const promise = sut.save(surveyResultData)
    await expect(promise).rejects.toThrow()
  })
})
