import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequiredFields Validation', () => {
  test('Should returns a MissingParamError if validator fails ', () => {
    const sut = new RequiredFieldValidation('field')
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = new RequiredFieldValidation('name')
    const error = sut.validate({ name: 'any_name' })
    expect(error).toBeFalsy()
  })
})
