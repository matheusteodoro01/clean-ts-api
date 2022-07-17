import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResult, SaveSurveyResultModel } from '@/domain/usecases/survey-result/save-survey-result'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'

import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpRequest, SurveyModel } from './save-survey-result-controller-protocols'
import MockDate from 'mockdate'

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  dbSaveSurveyResultStub: SaveSurveyResult

}

const makeFakeRequest = (): HttpRequest => ({ params: { surveyId: 'any_survey_id' }, body: { answer: 'any_answer' }, accountId: 'any_account_id' })

const makeFakeSurveyResukt = (): SurveyResultModel => ({
  id: 'valid_id',
  surveyId: 'any_survey_id',
  accountId: 'any_id',
  answer: '',
  date: new Date()
})

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_survey_id',
  question: 'any_question',
  answers: [
    {
      answer: 'any_answer',
      image: 'any_image'
    },
    {
      answer: 'other_answer'
    }
  ],
  date: new Date()
})
const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return await Promise.resolve(makeFakeSurvey())
    }
  }
  return new LoadSurveyByIdStub()
}

const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  class DbSaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return await Promise.resolve(makeFakeSurveyResukt())
    }
  }
  return new DbSaveSurveyResultStub()
}
const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const dbSaveSurveyResultStub = makeDbSaveSurveyResult()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, dbSaveSurveyResultStub)
  return { sut, loadSurveyByIdStub, dbSaveSurveyResultStub }
}

describe('SaveSurveyResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadSurveyByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(makeFakeRequest())
    expect(loadSurveyByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, dbSaveSurveyResultStub } = makeSut()
    const dbSaveSurveyResultSpy = jest.spyOn(dbSaveSurveyResultStub, 'save')
    await sut.handle(makeFakeRequest())
    expect(dbSaveSurveyResultSpy).toHaveBeenCalledWith({ surveyId: 'any_survey_id', accountId: 'any_account_id', date: new Date(), answer: 'any_answer' })
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadSurveyById fails', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValue(Promise.reject(new Error()))
    const HttpResponse = await sut.handle(httpRequest)
    expect(HttpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 403 if an invalid anwser provided', async () => {
    const { sut } = makeSut()
    const httpRequest = { params: { surveyId: 'any_survey_id' }, body: { answer: 'wrong_answer' }, accountId: 'any_account_id' }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })
})
