import { mockSurveyParams } from '@/domain/test'
import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }
  describe('add(', () => {
    test('Should return an survey on add success', async () => {
      const sut = makeSut()
      const survey = await sut.add(mockSurveyParams())
      expect(survey).toBeTruthy()
      expect(survey?.question).toBe('any_question')
    })
  })

  describe('loadAll()', () => {
    test('Should return an surveys on success', async () => {
      await surveyCollection.insertMany([
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
        },
        {
          question: 'other_question',
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

      ])
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].id).toBeTruthy()
      expect(surveys[1].question).toBe('other_question')
    })
    test('Should return empty array if survey does not exists', async () => {
      const sut = makeSut()
      const answers = await sut.loadAll()
      expect(answers).toEqual([])
    })
  })

  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
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
      const sut = makeSut()
      const survey = await sut.loadById(id)
      expect(survey.id).toBeTruthy()
      expect(survey.question).toBeTruthy()
    })
  })
})
