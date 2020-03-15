import mongoose from 'mongoose'

const Schema = mongoose.Schema

//@desc: Product's Category
const CategorySchema = new Schema({
  categoryName: {
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

export interface ICategeory extends mongoose.Document {
  categoryName: string
  date: number
}

export const Category = mongoose.model<ICategeory>('categories', CategorySchema)
