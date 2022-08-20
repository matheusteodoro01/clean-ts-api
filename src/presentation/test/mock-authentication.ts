import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication'

export const mockAuthentication = (): Authentication => {
  class Authentication implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<string> {
      return await Promise.resolve('valid_token')
    }
  }
  return new Authentication()
}
