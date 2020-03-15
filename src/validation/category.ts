import Validator from 'validator'
import isEmpty from './is-empty'

interface ICategoryValidation {
  categoryName: string
}

interface ICategoryErrors {
  categoryName?: string
}

export default function validateCategoryInput(data: ICategoryValidation) {
  const errors: ICategoryErrors = {}

  data.categoryName = !isEmpty(data.categoryName) ? data.categoryName : ''

  // Category Name
  if (!Validator.isLength(data.categoryName, { max: 80 })) {
    errors.categoryName = "Product's Category must be less than 80 characters"
  }
  if (Validator.isEmpty(data.categoryName)) {
    errors.categoryName = 'Text field is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
