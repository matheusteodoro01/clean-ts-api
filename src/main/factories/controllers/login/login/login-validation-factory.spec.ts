import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'
import { makeLoginValidation } from './login-validation-factory'
import { mockEmailValidator } from '@/validation/test'

jest.mock('@/validation/validators/validation-composite')

describe('Signup Validation', () => {
  test('Should call ValidationComposite if all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', mockEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
