import { LoadAccountByEmailRepository } from '../../../data/protocols/db/load-account-by-email-repository'
import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'

export class DbAuthetication implements Authentication {
  constructor (private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {

  }

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    const user = await this.loadAccountByEmailRepository.load(authentication.email)
    if (!user) { return await Promise.resolve(null) }
    return await Promise.resolve('')
  }
}
