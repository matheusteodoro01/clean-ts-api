import * as bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hashed_value'))
  }
}))
describe('Bcrypt Adapter', () => {
  test('Should call Bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)

    const hashSPy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')

    expect(hashSPy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should Bcrypt return a hash on sucess', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)

    const hash = await sut.encrypt('any_value')

    expect(hash).toBe('hashed_value')
  })
})
