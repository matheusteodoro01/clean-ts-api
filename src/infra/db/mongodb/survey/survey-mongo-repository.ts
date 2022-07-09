import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { AddSurveyRepository } from '@/data/usecases/add-survey/db-add-survey-protocols'
import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()
    return surveys as unknown as SurveyModel[]
  }

  async add (survey: AddSurveyModel): Promise<AddSurveyModel> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    const surveyData = await (await surveyCollection).insertOne(survey)
      .then(async data => {
        return await (await surveyCollection).findOne(data.insertedId)
      })
    return MongoHelper.map(surveyData)
  }
}
