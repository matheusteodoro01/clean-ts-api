import { LoadAccountByEmailRepository } from '../../../data/protocols/load-account-by-email-repository'
import { Authentication, AuthenticationModel } from '../authentication'

export class DbAuthetication implements Authentication {
  constructor (private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {

  }

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    await this.loadAccountByEmailRepository.load(authentication.email)
    return await Promise.resolve('')
  }
}