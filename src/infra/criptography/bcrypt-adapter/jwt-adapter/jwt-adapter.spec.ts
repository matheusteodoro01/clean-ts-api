import jwt from 'jsonwebtoken'
import { Encrypter } from '../../../../data/protocols/criptography/encrypter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await Promise.resolve('any_token')
  }
}))

const makeSut = (): Encrypter => {
  class JwtAdapterStub implements Encrypter {
    constructor (private readonly secretKey: string) {}
    async encrypt (value: string): Promise<string> {
      const accessToken = jwt.sign({ id: value }, this.secretKey)
      return accessToken
    }
  }
  return new JwtAdapterStub('secret_key')
}
describe('Jwt Adapter', () => {
  test('Should calls sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret_key')
  })
  test('Should return a token on sign success', async () => {
    const sut = makeSut()
    const accessToken = await sut.encrypt('any_id')
    expect(accessToken).toBe('any_token')
  })
})
