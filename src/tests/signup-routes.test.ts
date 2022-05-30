import request from 'supertest'
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import app from '../main/config/app'

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /singup', () => {
    test('Shold return 200 on sigup', async () => {
      await request(app)
        .post('/api/signup')
        .send(({
          name: 'Matheus',
          email: 'matheusteodoro01@hotmail.com',
          password: '1234',
          passwordConfirmation: '1234'
        }))
        .expect(200)
    })
  })
})
