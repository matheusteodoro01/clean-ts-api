import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('name')
}
describe('RequiredFields Validation', () => {
  test('Should returns a MissingParamError if validator fails ', () => {
    const sut = makeSut()
    const error = sut.validate({ email: 'any_email' })
    expect(error).toEqual(new MissingParamError('name'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ name: 'any_name' })
    expect(error).toBeFalsy()
  })
})
