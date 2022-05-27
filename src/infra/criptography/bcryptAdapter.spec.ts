import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hashed_value'))
  },
  async compare (value: string, hashValue: string): Promise<Boolean> {
    return await Promise.resolve(true)
  }
}))

const makeSut = (): BcryptAdapter => {
  const salt = 12
  const sut = new BcryptAdapter(salt)
  return sut
}

const salt = 12
describe('Bcrypt Adapter', () => {
  test('Should call hash with correct values', async () => {
    const sut = makeSut()

    const hashSPy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')

    expect(hashSPy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a valid hash on sucess', async () => {
    const sut = makeSut()

    const hash = await sut.hash('any_value')

    expect(hash).toBe('hashed_value')
  })

  test('Should throw if hash method trows', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(Promise.reject(new Error('any_error')) as any)
    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow(new Error('any_error'))
  })

  test('Should call compare with correct values', async () => {
    const sut = makeSut()
    const compareSPy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'hashed_value')
    expect(compareSPy).toHaveBeenCalledWith('any_value', 'hashed_value')
  })
})
