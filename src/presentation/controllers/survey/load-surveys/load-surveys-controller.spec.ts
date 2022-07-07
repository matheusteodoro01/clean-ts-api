
import { LoadSurveysController } from './load-surveys-controller'
import { LoadSurveys, SurveyModel } from './load-surveys-protocols'
import MockDate from 'mockdate'

interface SutTypes {
  sut: LoadSurveysController
  loadSurveysUseCaseStub: LoadSurveys
}

const makeFakeSurveys = (): SurveyModel[] => (
  [{
    id: 'any_id',
    question: 'any_version',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }]
)

const makeLoadSurveysStub = (): LoadSurveys => {
  class LoadSurveysUseCaseStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await Promise.resolve(makeFakeSurveys())
    }
  }
  return new LoadSurveysUseCaseStub()
}

const makeSut = (): SutTypes => {
  const loadSurveysUseCaseStub = makeLoadSurveysStub()
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
})
