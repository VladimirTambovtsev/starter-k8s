import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: 1,
    maxlength: 100
  },
  emailConfirmed: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 150
  },
  name: {
    type: String,
    required: true,
    maxlength: 30
  },
  lastname: {
    type: String,
    required: true,
    maxlength: 80
  },
  avatar: {
    type: String
  },
  cart: {
    type: Array,
    default: []
  },
  history: {
    type: Array,
    default: []
  },
  role: {
    type: Number,
    default: 0
  },
  resetToken: {
    type: String
  },
  resetTokenExpires: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now()
  }
})

UserSchema.pre<IUser>('save', async function(next) {
  const user = this
  const saltRounds = 10

  if (user.isModified('password')) {
    try {
      const genSalt = await bcrypt.genSalt(saltRounds)
      await bcrypt
        .hash(user.password, genSalt)
        .then(hash => (user.password = hash))
        .catch(err => next(err))
    } catch (err) {
      return next(err)
    }
  }

  next()
})

export interface IUser extends mongoose.Document {
  email: string
  emailConfirmed: boolean
  password: string
  name: string
  lastname: string
  avatar: string
  cart: [string]
  history: [string]
  role: number
  resetToken: string
  resetTokenExpires: string
}

export const User = mongoose.model<IUser>('users', UserSchema)
