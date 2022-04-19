import request from 'supertest'
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import app from '../main/config/app'

describe('Signup Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  test('Shold return an account on sucess', async () => {
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
