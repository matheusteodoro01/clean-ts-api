import { AccountModel, AddAccountParams, Hasher } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'
import { AddAcountRepository } from '@/data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { mockAccountModel, mockAddAccountParams, throwError } from '@/tests'

interface sutTypes {
  sut: DbAddAccount
  hasherStub: Hasher
  addAcountRepositoryStub: AddAcountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadAccountByEmail (email: string): Promise<AccountModel> {
      return await Promise.resolve(null)
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise(resolve => resolve('any_password'))
    }
  }
  return new HasherStub()
}

const makeAddAcountRepositoryStub = (): AddAcountRepository => {
  class AddAcountRepositoryStub implements AddAcountRepository {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return await new Promise(resolve => resolve(mockAccountModel()))
    }
  }
  return new AddAcountRepositoryStub()
}

const makeSut = (): sutTypes => {
  const hasherStub = makeHasher()
  const addAcountRepositoryStub = makeAddAcountRepositoryStub()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAddAccount(hasherStub, addAcountRepositoryStub, loadAccountByEmailRepositoryStub)

  return { sut, hasherStub, addAcountRepositoryStub, loadAccountByEmailRepositoryStub }
}

describe('DdAddAccountUsecase', () => {
  test('Should call Encripter with correct password ', async () => {
    const { hasherStub, sut } = makeSut()
    const encriptSpy = jest.spyOn(hasherStub, 'hash')
    const accountData = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }
    await sut.add(accountData)
    expect(encriptSpy).toHaveBeenCalledWith('any_password')
  })

  test('Should throw if Encripter trows', async () => {
    const { hasherStub, sut } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockImplementation(throwError)
    const accountData = {
      name: 'any_name',
      email: 'any_name',
      password: 'any_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAcountRepository with correct values', async () => {
    const { addAcountRepositoryStub, sut } = makeSut()
    const addSpy = jest.spyOn(addAcountRepositoryStub, 'add')
    await sut.add(mockAddAccountParams())
    expect(addSpy).toHaveBeenCalledWith(mockAddAccountParams())
  })

  test('Should throw if AddAcountRepository trows', async () => {
    const { addAcountRepositoryStub, sut } = makeSut()
    jest.spyOn(addAcountRepositoryStub, 'add').mockImplementation(throwError)
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account if on sucess', async () => {
    const { sut } = makeSut()
    const account = await sut.add(mockAddAccountParams())
    expect(account).toEqual(mockAccountModel())
  })

  test('Should call LoadAccountByEmailRepository with correct email ', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadAccountByEmail')
    await sut.add(mockAddAccountParams())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return null if LoadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadAccountByEmail').mockResolvedValueOnce(Promise.resolve(mockAccountModel()))
    const account = await sut.add(mockAddAccountParams())
    expect(account).toBeNull()
  })
})
