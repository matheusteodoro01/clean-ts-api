import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import app from '../main/config/app'

import { hash } from 'bcrypt'

let accountCollection: Collection
describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
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

  describe('POST /login', () => {
    test('Shold return 200 on login', async () => {
      const password = await hash('1234', 12)
      await accountCollection.insertOne({
        name: 'Matheus',
        email: 'matheusteodoro01@hotmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send(({
          email: 'matheusteodoro01@hotmail.com',
          password: '1234'
        }))
        .expect(200)
    })
    test('Shold return 401 on login', async () => {
      const password = await hash('1234', 12)
      await accountCollection.insertOne({
        name: 'Matheus',
        email: 'matheusteodoro01@hotmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send(({
          email: 'matheusteodoro01@hotmail.com',
          password: '12345'
        }))
        .expect(401)
    })
  })
})
