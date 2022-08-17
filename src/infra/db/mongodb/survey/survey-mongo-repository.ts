import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-idrepository'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { AddSurveyRepository } from '@/data/usecases/survey/add-survey/db-add-survey-protocols'
import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })
    return survey && MongoHelper.map(survey)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()
    return MongoHelper.mapCollection(surveys)
  }

  async add (survey: AddSurveyParams): Promise<AddSurveyParams> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    const surveyData = await (await surveyCollection).insertOne(survey)
      .then(async data => {
        return await (await surveyCollection).findOne(data.insertedId)
      })
    return surveyData && MongoHelper.map(surveyData)
  }
}
