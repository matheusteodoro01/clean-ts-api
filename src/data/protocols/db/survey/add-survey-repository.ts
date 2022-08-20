import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'

export interface AddSurveyRepository {
  add: (model: AddSurveyParams) => Promise<AddSurveyParams>
}
