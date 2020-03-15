import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import mailer from 'nodemailer'
// import hbs from 'nodemailer-express-handlebars'  // @TODO: no @types enabled

// // File Upload
// import cloudinary from 'cloudinary'
// import formidable from 'express-formidable'

// Load Models
import { User } from './../../../models/User'
import { Product } from './../../../models/Product'

// Validation
import validateRegisterInput from '../../../validation/register'
import validateLoginInput from '../../../validation/login'

require('dotenv').config() // reads env file

const router = express.Router()

// nodemailer
const transporter = mailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
  // host; port; secure (ssl)
})

// @desc: Return current user
// @access: Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      data: {
        id: req.user.id,
        name: req.user.name,
        lastname: req.user.lastname,
        email: req.user.email,
        role: req.user.role,
        cart: req.user.cart,
        history: req.user.history
      }
    })
  }
)

router.post('/register', async (req, res) => {
  // // Validate req.body
  const { errors, isValid } = validateRegisterInput(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }

  // Check unique email
  const emailExists = await User.findOne({ email: req.body.email })
  if (emailExists) {
    errors.email = 'Email have already exists'
    return res.status(400).json(errors)
  }

  // Save
  const user = new User({
    name: req.body.name,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password
  })

  user.save((err, doc) => {
    if (err) {
      return res.json({
        success: false,
        errors: err
      })
    }
    res.status(200).json({
      success: true,
      data: doc
    })
  })

  // @TODO: send email confirmation
  // transporter.use(
  //   'compile',
  //   hbs({
  //     viewPath: 'server/config/mails',
  //     extName: '.hbs'
  //   })
  // )
  // const mailOptions = {
  //   from: `eCommerce - <${process.env.EMAIL}>`,
  //   to: req.body.email,
  //   subject: `Welcome to eCommerce, ${req.body.email}`,
  //   template: 'confirm_email',
  //   context: {
  //     email: req.body.email
  //   }
  // }
  // transporter.sendMail(mailOptions, (err, res) => {
  //   if (err) console.log(err)
  //   transporter.close()
  // })
})

router.post('/login', async (req, res) => {
  // Validate req.body
  const { errors, isValid } = validateLoginInput(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }

  const { email, password } = req.body

  // Check email
  const user = await User.findOne({ email })
  if (!user) {
    errors.email = 'Invalid Email or Password'
    return res.status(400).json(errors)
  }

  // Compare passwords
  const passwordsMatch = await bcrypt.compare(password, user.password)
  if (passwordsMatch) {
    const payload = {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      role: user.role,
      email: user.email,
      emailConfirmed: user.emailConfirmed,
      cart: user.cart,
      history: user.history
    }

    jwt.sign(
      payload,
      process.env.SECRET_KEY as string,
      { expiresIn: 3600 },
      (err, token) => {
        // if (err) {
        // 	return res.json({
        // 		success: false,
        // 		errors: err
        // 	})
        // }
        res.json({
          success: true,
          token: `Bearer ${token}` // protocol
        })
      }
    )
  } else {
    errors.password = 'Invalid Email or Password'
    return res.status(400).json(errors)
  }
})

export default router
