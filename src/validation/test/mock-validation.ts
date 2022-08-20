import { Validation } from '@/presentation/protocols'

export const mockValidation = (): Validation => {
  class Validation implements Validation {
    validate (input: any): Error | undefined {
      return undefined
    }
  }
  return new Validation()
}
