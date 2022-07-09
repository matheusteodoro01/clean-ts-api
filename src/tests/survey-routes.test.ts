import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import app from '../main/config/app'
import { sign } from 'jsonwebtoken'
import env from '../main/config/env'
import { hash } from 'bcrypt'

let surveyCollection: Collection
let accountCollection: Collection
describe('Survey Routes', () => {
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
    test('Shold return 204 if valid access token is provided', async () => {
      const password = await hash('1234', 12)
      const res = await accountCollection.insertOne({
        name: 'Matheus',
        email: 'matheusteodoro01@hotmail.com',
        password,
        role: 'admin'
      })
      const id = res.insertedId
      const accessToken = sign({ id }, env.jtwSecret)
      await accountCollection.updateOne({ _id: id }, {
        $set: { accessToken }
      })
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
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
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Shold return 403 on load surveys without access token', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })
  })
})
