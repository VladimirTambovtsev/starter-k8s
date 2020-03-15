import express, { Request, Response } from 'express'
import passport from 'passport'

import { Product } from '../../../models/Product'
import validateProductInput from '../../../validation/product'

const router = express.Router()

// @desc: Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({})
    if (products) {
      res.status(200).json(products)
    } else {
      res.status(204).json({
        success: true,
        data: ['No Products Yet']
      })
    }
  } catch (err) {
    res.status(500).send({ errors: err })
  }
})

// @desc: Get product by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id }: any = req.params // @TODO: refactor params type

    // @TODO: add brands and categories for products
    const product = await Product.findById(id)
    // .populate('brand')   // get array of brand ids
    // .populate('categories')

    if (product) {
      res.status(200).json(product)
    } else {
      res.status(404).json({
        success: true,
        data: ['No Such Product']
      })
    }
  } catch (err) {
    res.status(500).send({ errors: err })
  }
})

// @desc: Add product to shop
router.post('/', async (req: Request, res: Response) => {
  // Check role admin
  // const user = await User.findOne({
  //   _id: req.user._id
  // })
  // if (user.role !== 1) {
  //   return res.status(403).json({
  //     errors: 'No Access Rights'
  //   })
  // }

  console.log('req.body: ', req.body)

  // Check validation
  const { errors, isValid } = validateProductInput(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }

  // @TODO: check for UNIQUE producName

  // Save
  const product = new Product({
    productName: req.body.productName,
    price: req.body.price,
    description: req.body.description,
    shipping: req.body.shipping,
    available: req.body.available,
    brand: req.body.brand,
    categories: req.body.categories,
    sold: req.body.sold,
    publish: req.body.publish,
    images: req.body.images,
    reviews: req.body.reviews
  })

  product
    .save()
    .then(prod => {
      res.json({
        success: true,
        data: prod
      })
    })
    .catch(err => {
      res.json({
        success: false,
        errors: err
      })
    })
})

// @desc: Delete product
router.delete('/delete/:id', async (req, res) => {
  // Check if authenticated by middleware
  // Check role
  const { id }: any = req.params // @TODO: refactor params type

  const product = await Product.findById(id)
  if (product) {
    product
      .remove()
      .then(() => res.json({ success: true }))
      .catch(err => res.send(500).send({ errors: err }))
  } else {
    res.status(204).json({
      success: true,
      data: ['No Product Found with this ID']
    })
  }
})

export default router
