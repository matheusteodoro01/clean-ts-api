import { SurveyModel } from '@/domain/models/survey'
import { mockSurveyModel } from '@/domain/test'
import { AddSurvey, AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'

export const mockAddSuvey = (): AddSurvey => {
  class AddSurvey {
    async add (data: AddSurveyParams): Promise<void> {
      return await Promise.resolve(null)
    }
  }
  return new AddSurvey()
}

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysUseCase implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await Promise.resolve([mockSurveyModel()])
    }
  }
  return new LoadSurveysUseCase()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyById implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return await Promise.resolve(mockSurveyModel())
    }
  }
  return new LoadSurveyById()
}
