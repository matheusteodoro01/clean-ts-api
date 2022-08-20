import { mockEncrypter, mockHashCompare, mockLoadAccountByEmailRepository, mockUpdateAccessTokenRepository } from '@/data/test/'
import { mockAuthenticationParams, throwError } from '@/domain/test'
import { DbAuthetication } from './db-authentication'
import { LoadAccountByEmailRepository, HashComparer, Encrypter, UpdateAccessTokenRepository } from './db-authentication-protocols'

type SutTypes = {
  sut: DbAuthetication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const hashComparerStub = mockHashCompare()
  const encrypterStub = mockEncrypter()
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()
  const sut = new DbAuthetication(loadAccountByEmailRepositoryStub, hashComparerStub, encrypterStub, updateAccessTokenRepositoryStub)
  return { sut, loadAccountByEmailRepositoryStub, hashComparerStub, encrypterStub, updateAccessTokenRepositoryStub }
}

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email ', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadAccountByEmail')
    await sut.auth(mockAuthenticationParams())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  test('Should throw if LoadAccountByEmailRepository throws ', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadAccountByEmail').mockImplementation(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadAccountByEmail').mockResolvedValueOnce(Promise.resolve(null))
    const authetication = await sut.auth(mockAuthenticationParams())
    expect(authetication).toBeNull()
  })

  test('Should call HashComparer with correct password', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(mockAuthenticationParams())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })
  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const tokeSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(mockAuthenticationParams())
    expect(tokeSpy).toHaveBeenCalledWith('any_id')
  })
  test('Should throw if Encrypter throws ', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementation(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should Encrypter return token', async () => {
    const { sut } = makeSut()
    const acessToken = await sut.auth(mockAuthenticationParams())
    expect(acessToken).toBe('valid_token')
  })
  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    await sut.auth(mockAuthenticationParams())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'valid_token')
  })
  test('Should throw if UpdateAccessTokenRepository throws ', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockImplementation(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })
})
