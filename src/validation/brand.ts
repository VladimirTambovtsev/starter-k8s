import Validator from 'validator'
import isEmpty from './is-empty'

interface IBrandValidation {
  brandName: string
}

interface IBrandErrors {
  brandName?: string
}

export default function validateBrandInput(data: IBrandValidation) {
  const errors: IBrandErrors = {}

  data.brandName = !isEmpty(data.brandName) ? data.brandName : ''

  // Brand Name
  if (!Validator.isLength(data.brandName, { max: 100 })) {
    errors.brandName = 'Brand Name must be less than 100 characters'
  }
  if (Validator.isEmpty(data.brandName)) {
    errors.brandName = 'Text field is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
