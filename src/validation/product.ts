import Validator from 'validator'
import isEmpty from './is-empty'

interface IProductValidation {
  productName: string
  price: number
  description: string
  shipping: boolean
  available: boolean
  brand: string
  categories: string
  publish: boolean
  sold: number
}

interface IProductErrors {
  productName?: string
  price?: string
  description?: string
  shipping?: string
  available?: string
  brand?: string
  categories?: string
  publish?: string
  sold?: string
}

export default function validateProductInput(data: IProductValidation) {
  const errors: IProductErrors = {}

  data.productName = !isEmpty(data.productName) ? data.productName : ''
  data.description = !isEmpty(data.description) ? data.description : ''

  // Product Name
  if (!Validator.isLength(data.productName, { max: 80 })) {
    errors.productName = 'Product Name must be less than 80 cahracters'
  }
  if (Validator.isEmpty(data.productName)) {
    errors.productName = 'Text field is required'
  }

  // Product Price
  if (isNaN(Number(data.price))) {
    errors.price = 'Price field is required'
  }

  // Product sold
  if (isNaN(Number(data.sold))) {
    errors.price = 'Price sold is required'
  }

  // Product Description
  if (!Validator.isLength(data.description, { max: 2000 })) {
    errors.description = 'Product description must be less than 2000 cahracters'
  }
  if (Validator.isEmpty(data.description)) {
    errors.description = 'Description field is required'
  }

  // Product Brand
  if (Validator.isEmpty(data.brand)) {
    errors.brand = 'Brand field is required'
  }

  // Product category
  if (Validator.isEmpty(data.categories)) {
    errors.categories = 'Category field is required'
  }

  // Shipping
  if (typeof data.shipping !== 'boolean') {
    errors.shipping = 'Shipping must be true of false'
  }

  // Available
  if (typeof data.available !== 'boolean') {
    errors.available = 'Available field must be true of false'
  }

  // Publish
  if (typeof data.publish !== 'boolean') {
    errors.publish = 'Publish field is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
