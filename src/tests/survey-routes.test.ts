import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import app from '../main/config/app'

let surveyCollection: Collection
describe('Survey Routes', () => {
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

  describe('POST /surveys', () => {
    test('Shold return 403 on add survey without access token', async () => {
      await request(app)
        .post('/api/surveys')
        .send(({
          question: 'any_question',
          answers: [
            {
              answer: 'Answer 1',
              image: 'https:image-name.com'
            },
            {
              answer: 'Answer 2'
            }
          ]
        }))
        .expect(403)
    })
  })
})
