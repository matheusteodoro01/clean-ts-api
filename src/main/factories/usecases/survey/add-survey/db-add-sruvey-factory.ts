import { DbAddSuvery } from '@/data/usecases/add-survey/db-add-survey'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbAddSurvey = (): DbAddSuvery => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbAddSuvery(surveyMongoRepository)
}
