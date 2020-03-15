import express, { Request, Response } from 'express'
import { Brand } from '../../../models/Brand'
import validateBrandInput from '../../../validation/brand'

const router = express.Router()

// @desc: Get all brands
router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find({})
    if (brands) {
      res.status(200).json(brands)
    } else {
      res.status(204).json({
        success: true,
        data: ['No Brands Yet']
      })
    }
  } catch (err) {
    res.status(500).send({ errors: err })
  }
})

// @desc: Add product to shop
router.post('/', async (req, res) => {
  // Check role admin
  // const user = await User.findOne({
  //   _id: req.user._id
  // })
  // if (user.role !== 1) {
  //   return res.status(403).json({
  //     errors: 'No Access Rights'
  //   })
  // }

  // Check validation
  const { errors, isValid } = validateBrandInput(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }

  // @TODO: Validate Felds

  // @TODO: check for UNIQUE brandName

  console.log('req.body: ', req.body)

  // Save
  const brand = new Brand({
    brandName: req.body.brandName
  })

  brand
    .save()
    .then(brand => {
      res.json({
        success: true,
        data: brand
      })
    })
    .catch(err => {
      res.json({
        success: false,
        errors: err
      })
    })
})

export default router
