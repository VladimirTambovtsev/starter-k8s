import mongoose, { Schema, Document } from 'mongoose'

const ProductSchema = new Schema(
  {
    productName: {
      required: true,
      type: String,
      maxlength: 80,
      unique: 1
    },
    price: {
      required: true,
      type: Number,
      maxlength: 255
    },
    description: {
      required: true,
      type: String,
      maxlength: 2000
    },
    shipping: {
      required: true,
      type: Boolean
    },
    available: {
      required: true,
      type: Boolean
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'brands',
      required: true
    },
    categories: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
      required: true
    },
    sold: {
      type: Number,
      maxlength: 100,
      default: 0
    },
    publish: {
      required: true,
      type: Boolean
    },
    images: {
      type: Array,
      default: []
    },
    reviews: [
      {
        reviewDescription: {
          required: true,
          type: String
        },
        reviewUser: {
          type: Schema.Types.ObjectId,
          ref: 'users'
        },
        reviewDate: {
          required: true,
          type: Date
        }
      }
    ]
  },
  { timestamps: true }
)

export interface IProduct extends mongoose.Document {
  productName: string
  price: number
  description: string
  shipping: boolean
  available: boolean
  sold: number
  publish: boolean
  images?: [string]
  reviews?: [string]
  brand: [string]
  categories: [string]
}

export const Product = mongoose.model<IProduct>('products', ProductSchema)
