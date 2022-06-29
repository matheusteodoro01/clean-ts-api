import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { AccountModel } from '../add-acount/db-add-account-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'

interface SutTypes {
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
  sut: DbLoadAccountByToken
}

const makeLoadAccountByTokenRepositoryStub = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadAccountByToken (accessToken: string, role?: string): Promise<AccountModel> {
      return await Promise.resolve({ id: 'any_id', email: 'any_email', name: 'any_name', password: 'any_password' })
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}
const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (): Promise<string> {
      return await Promise.resolve('any_value')
    }
  }
  return new DecrypterStub()
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypterStub()
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepositoryStub()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
  return { sut, decrypterStub, loadAccountByTokenRepositoryStub }
}

describe('DbLoadAccountByToken UseCase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decrypterStubSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token')
    expect(decrypterStubSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadAccountByTokenRepositoryStubSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadAccountByToken')
    await sut.load('any_token', 'any_role')
    expect(loadAccountByTokenRepositoryStubSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return null if Decrypter with return null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null))
    const account = await sut.load('any_token')
    expect(account).toBeNull()
  })
})
