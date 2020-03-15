import mongoose from 'mongoose'

const Schema = mongoose.Schema

//@desc: Product's Brand
const BrandSchema = new Schema({
  brandName: {
    required: true,
    type: String,
    unique: 1,
    maxlength: 80
  },
  date: {
    type: Date,
    default: Date.now()
  }
})

export interface IBrand extends mongoose.Document {
  brandName: string
  date: number
}

export const Brand = mongoose.model<IBrand>('brands', BrandSchema)
