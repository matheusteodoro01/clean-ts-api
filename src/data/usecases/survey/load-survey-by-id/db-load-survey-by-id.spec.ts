import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-idrepository'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import MockDate from 'mockdate'
import { mockSurveyModel, throwError } from '@/tests'

type SutTypes = {
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
  sut: LoadSurveyById
}

const makeLoadSurveyByIdRepositoryStub = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return await Promise.resolve(mockSurveyModel())
    }
  }

  return new LoadSurveyByIdRepositoryStub()
}
const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepositoryStub()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
  return { loadSurveyByIdRepositoryStub, sut }
}

describe('DbLoadSurveyById UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should LoadSurveyByIdRepository with correct values', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadSurveyByIdRepositorySpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadById('any_id')
    expect(loadSurveyByIdRepositorySpy).toHaveBeenCalledWith('any_id')
  })
  test('Should return survey of Survey on success', async () => {
    const { sut } = makeSut()
    const survey = await sut.loadById('any_id')
    expect(survey).toEqual(mockSurveyModel())
  })

  test('Should throw if LoadSurveyByIdRepository trows', async () => {
    const { loadSurveyByIdRepositoryStub, sut } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockImplementation(throwError)
    const promise = sut.loadById('any_id')
    await expect(promise).rejects.toThrow()
  })
})
