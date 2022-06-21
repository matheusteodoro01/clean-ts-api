import { Hasher } from '../../../data/protocols/criptography/hasher'
import * as bcrypt from 'bcrypt'
import { HashComparer } from '../../../data/protocols/criptography/hash-comparer'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) {

  }

  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }

  async compare (value: string, hashValue: string): Promise<Boolean> {
    const isvalid = await bcrypt.compare(value, hashValue)
    return isvalid
  }
}
