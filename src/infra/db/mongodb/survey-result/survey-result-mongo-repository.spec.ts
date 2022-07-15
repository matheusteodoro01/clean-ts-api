import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}
const makeSurvey = async (): Promise<string> => {
  const res = await surveyCollection.insertOne(
    {
      question: 'any_question',
      answers: [
        {
          answer: 'any_answer',
          image: 'any_image'
        },
        {
          answer: 'other_answer'
        }
      ],
      date: new Date()
    }
  )
  const id = res.insertedId.toString()
  return id
}

const makeAccount = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password'
  })
  const id = res.insertedId.toString()
  return id
}
describe('Survey Result Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
  })

  describe('save(', () => {
    test('Should add a survey  result if its new ', async () => {
      const sut = makeSut()
      const surveyId = await makeSurvey()
      const accountId = await makeAccount()
      const surveyResult = await sut.save({
        surveyId,
        accountId,
        date: new Date(),
        answer: 'any_answer'
      })
      expect(surveyResult.accountId).toBe(accountId)
      expect(surveyResult.surveyId).toBe(surveyId)
      expect(surveyResult.answer).toBe('any_answer')
    })
  })
})
