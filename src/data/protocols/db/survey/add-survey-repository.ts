import { AddSurveyModel } from '@/domain/usecases/survey/add-survey'

export interface AddSurveyRepository {
  add: (model: AddSurveyModel) => Promise<AddSurveyModel>
}
