import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hashed_value'))
  }
}))

const makeSut = (): BcryptAdapter => {
  const salt = 12
  const sut = new BcryptAdapter(salt)
  return sut
}

const salt = 12
describe('Bcrypt Adapter', () => {
  test('Should call Bcrypt with correct values', async () => {
    const sut = makeSut()

    const hashSPy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')

    expect(hashSPy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should Bcrypt return a hash on sucess', async () => {
    const sut = makeSut()

    const hash = await sut.encrypt('any_value')

    expect(hash).toBe('hashed_value')
  })

  test('Should throw if bcrypt trows', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(Promise.reject(new Error('any_error')) as any)
    const promise = sut.encrypt('any_value')
    await expect(promise).rejects.toThrow(new Error('any_error'))
  })
})
