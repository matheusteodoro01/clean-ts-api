import request from 'supertest'
import app from '../main/config/app'

describe('Signup Routes', () => {
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
