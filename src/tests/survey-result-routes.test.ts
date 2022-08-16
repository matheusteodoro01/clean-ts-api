import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import app from '../main/config/app'
import { sign } from 'jsonwebtoken'
import env from '../main/config/env'
import { hash } from 'bcrypt'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
  const password = await hash('1234', 12)
  const res = await accountCollection.insertOne({
    name: 'Matheus',
    email: 'matheusteodoro01@hotmail.com',
    password
  })
  const id = res.insertedId
  const accessToken = sign({ id }, env.jtwSecret)
  await accountCollection.updateOne({ _id: id }, {
    $set: { accessToken }
  })
  return accessToken
}

describe('Survey Result Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
    await surveyCollection.deleteMany({})
  })
  describe('PUT /surveys/:surveryId/results', () => {
    test('Should return 403 on save survey result without access token', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send(({
          answer: 'any_answer',
          image: 'https:image-name.com'
        }))
        .expect(403)
    })

    test('Should return 200 on save survey result with access token', async () => {
      const accessToken = await makeAccessToken()
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
      await request(app)
        .put(`/api/surveys/${res.insertedId.toString()}/results`)
        .set('x-access-token', accessToken)
        .send(({
          answer: 'any_answer'
        }))
        .expect(200)
    })
  })
})
