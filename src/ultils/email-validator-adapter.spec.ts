import { EmailValidatorAdapter } from './email-validator'

describe('Email validator', () => {
  test('Should return false if validator return false', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid@email.com')
    expect(isValid).toBe(false)
  })
})
