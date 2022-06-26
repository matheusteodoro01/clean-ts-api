import { AddSurveyModel } from '@/domain/usecases/add-survey'

export interface AddSurveyRepository {
  add: (model: AddSurveyModel) => Promise<AddSurveyModel>
}
