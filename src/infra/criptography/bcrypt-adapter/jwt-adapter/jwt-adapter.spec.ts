import jwt from 'jsonwebtoken'

import { Encrypter } from '../../../../data/protocols/criptography/encrypter'

const makeSut = (): Encrypter => {
  class JwtAdapterStub implements Encrypter {
    constructor (private readonly secretKey: string) {}
    async encrypt (value: string): Promise<string> {
      jwt.sign({ id: value }, this.secretKey)
      return await Promise.resolve(value)
    }
  }
  return new JwtAdapterStub('secret_key')
}
describe('Jwt Adapter', () => {
  test('Should calls sign with correct values ', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret_key')
  })
})
