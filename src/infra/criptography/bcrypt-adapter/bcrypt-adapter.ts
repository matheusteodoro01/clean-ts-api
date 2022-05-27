import { Hasher } from '../../../data/protocols/criptography/hasher'
import * as bcrypt from 'bcrypt'
import { HashComparer } from '../../../data/protocols/criptography/hash-comparer'

export class BcryptAdapter implements Hasher, HashComparer {
  private readonly salt
  constructor (salt: number) {
    this.salt = salt
  }

  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }

  async compare (value: string, hashValue: string): Promise<Boolean> {
    const isvalid = await bcrypt.compare(value, hashValue)
    return isvalid
  }
}
