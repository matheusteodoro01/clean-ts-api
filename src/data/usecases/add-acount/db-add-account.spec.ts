import { AccountModel, AddAccountModel, Encrypter } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'
import { AddAcountRepository } from '../../protocols/add-account-repository'

interface sutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAcountRepositoryStub: AddAcountRepository
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new EncrypterStub()
}

const makeAddAcountRepositoryStub = (): AddAcountRepository => {
  class AddAcountRepositoryStub implements AddAcountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_name',
        password: 'hashed_password'
      }
      return await new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAcountRepositoryStub()
}

const makeSut = (): sutTypes => {
  const encrypterStub = makeEncrypter()
  const addAcountRepositoryStub = makeAddAcountRepositoryStub()
  const sut = new DbAddAccount(encrypterStub, addAcountRepositoryStub)

  return { sut, encrypterStub, addAcountRepositoryStub }
}

describe('DdAddAccount Usecase', () => {
  test('Should call Encripter with correct password ', async () => {
    const { encrypterStub, sut } = makeSut()
    const encriptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_name',
      password: 'valid_password'
    }
    await sut.add(accountData)

    expect(encriptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Encripter trows', async () => {
    const { encrypterStub, sut } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid_name',
      email: 'valid_name',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAcountRepository with correct values', async () => {
    const { addAcountRepositoryStub, sut } = makeSut()
    const addSpy = jest.spyOn(addAcountRepositoryStub, 'add')
    const accountData = {
      name: 'valid_name',
      email: 'valid_name',
      password: 'hashed_password'
    }
    await sut.add(accountData)

    await expect(addSpy).toHaveBeenCalledWith(accountData)
  })

  test('Should throw if AddAcountRepository trows', async () => {
    const { addAcountRepositoryStub, sut } = makeSut()
    jest.spyOn(addAcountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid_name',
      email: 'valid_name',
      password: 'hashed_password'
    }
    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })
})
