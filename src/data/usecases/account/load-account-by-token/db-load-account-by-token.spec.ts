import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { mockAccountModel, throwError } from '@/domain/test'
import { mockDecrypter, mockLoadAccountByTokenRepository } from '@/data/test'

type SutTypes = {
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
  sut: DbLoadAccountByToken
}

const makeSut = (): SutTypes => {
  const decrypterStub = mockDecrypter()
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository()
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
    expect(loadAccountByTokenRepositoryStubSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  test('Should return null if Decrypter with return null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null))
    const account = await sut.load('any_token')
    expect(account).toBeNull()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load('any_token', 'any_role')
    expect(account).toEqual(mockAccountModel())
  })

  test('Should throw if Decrypter trows', async () => {
    const { decrypterStub, sut } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockImplementation(throwError)
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if LoadAccountByTokenRepository trows', async () => {
    const { loadAccountByTokenRepositoryStub, sut } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadAccountByToken').mockImplementation(throwError)
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })
})
