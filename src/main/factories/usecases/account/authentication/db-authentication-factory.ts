import env from '@/main/config/env'
import { DbAuthetication } from '@/data/usecases/authentication/db-authentication'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { JwtAdapter } from '@/infra/criptography/bcrypt-adapter/jwt-adapter/jwt-adapter'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'

export const makeDbAuthetication = (): DbAuthetication => {
  const salt = 12
  const jwtAdapter = new JwtAdapter(env.jtwSecret)
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAuthetication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
}
