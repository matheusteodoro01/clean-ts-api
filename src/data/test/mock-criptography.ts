import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { Hasher } from '@/data/protocols/criptography/hasher'
import { Decrypter } from '../protocols/criptography/decrypter'
import { Encrypter } from '../protocols/criptography/encrypter'

export const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await Promise.resolve('any_password')
    }
  }
  return new HasherStub()
}

export const mockHashCompare = (): HashComparer => {
  class HashCompareStub implements HashComparer {
    async compare (password: string, hasedPassword: string): Promise<Boolean> {
      return true
    }
  }
  return new HashCompareStub()
}

export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (id: string): Promise<string> {
      return 'valid_token'
    }
  }
  return new EncrypterStub()
}

export const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (): Promise<string> {
      return await Promise.resolve('any_value')
    }
  }
  return new DecrypterStub()
}
