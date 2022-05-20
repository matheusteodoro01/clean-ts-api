import { EmailValidation } from './email-validation'
import { EmailValidator } from '../../protocols/email-validator'
import { InvalidParamError } from '../../errors'

interface SutTypes{
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  return emailValidatorStub
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)
  return { sut, emailValidatorStub }
}

describe('Email Validation', () => {
  test('Should return an error if EmailValidator returns false', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const error = await sut.validate({ email: 'any_email@email.com' })
    expect(error).toEqual(new InvalidParamError('email'))
  })
  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSPy = jest.spyOn(emailValidatorStub, 'isValid')

    sut.validate({ email: 'any_email@email.com' })

    expect(isValidSPy).toHaveBeenCalledWith('any_email@email.com')
  })

  test('Should throw if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })
})
