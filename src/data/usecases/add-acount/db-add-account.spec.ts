import { AccountModel, AddAccountModel, Hasher } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'
import { AddAcountRepository } from '../../protocols/db/add-account-repository'

const makeFakeMakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_name',
  password: 'valid_password'

})

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_name',
  password: 'hashed_password'
})

interface sutTypes {
  sut: DbAddAccount
  hasherStub: Hasher
  addAcountRepositoryStub: AddAcountRepository
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new HasherStub()
}

const makeAddAcountRepositoryStub = (): AddAcountRepository => {
  class AddAcountRepositoryStub implements AddAcountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeMakeAccount()))
    }
  }
  return new AddAcountRepositoryStub()
}

const makeSut = (): sutTypes => {
  const hasherStub = makeHasher()
  const addAcountRepositoryStub = makeAddAcountRepositoryStub()
  const sut = new DbAddAccount(hasherStub, addAcountRepositoryStub)

  return { sut, hasherStub, addAcountRepositoryStub }
}

describe('DdAddAccount Usecase', () => {
  test('Should call Encripter with correct password ', async () => {
    const { hasherStub, sut } = makeSut()
    const encriptSpy = jest.spyOn(hasherStub, 'hash')
    const accountData = {
      name: 'valid_name',
      email: 'valid_name',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encriptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Encripter trows', async () => {
    const { hasherStub, sut } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
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
    await sut.add(makeFakeAccountData())
    await expect(addSpy).toHaveBeenCalledWith(makeFakeAccountData())
  })

  test('Should throw if AddAcountRepository trows', async () => {
    const { addAcountRepositoryStub, sut } = makeSut()
    jest.spyOn(addAcountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account if on sucess', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAccountData())
    await expect(account).toEqual(makeFakeMakeAccount())
  })
})
