import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

class EncrypterStub implements Encrypter {
  async encrypt (value: string): Promise<string> {
    return await new Promise(resolve => resolve('hashed_password'))
  }
}

describe('DdAddAccount Usecase', () => {
  test('Should call Encripter with correct password ', async () => {
    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)
    const encriptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_name',
      password: 'valid_password'
    }
    await sut.add(accountData)

    expect(encriptSpy).toHaveBeenCalledWith('valid_password')
  })
})
