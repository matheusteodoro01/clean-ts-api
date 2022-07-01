import { AddSurveyRepository } from '@/data/usecases/add-survey/db-add-survey-protocols'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (survey: AddSurveyModel): Promise<AddSurveyModel> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    const surveyData = await (await surveyCollection).insertOne(survey)
      .then(async data => {
        return await (await surveyCollection).findOne(data.insertedId)
      })
    return MongoHelper.map(surveyData)
  }
}
