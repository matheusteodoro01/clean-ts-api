import { EmailValidation } from '@/validation/validators'
import { EmailValidator } from '@/validation/protocols/email-validator'
import { InvalidParamError } from '@/presentation/errors'
import { mockEmailValidator } from '@/validation/test'

interface SutTypes{
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = mockEmailValidator()
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
