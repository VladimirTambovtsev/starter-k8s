import express, { Request, Response } from 'express'
import { Category } from '../../../models/Category'
import validateCategoryInput from '../../../validation/category'

const router = express.Router()

// @desc: Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({})
    if (categories) {
      res.status(200).json(categories)
    } else {
      res.status(204).json({
        success: true,
        data: ['No Categories Yet']
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
  const { errors, isValid } = validateCategoryInput(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }

  // @TODO: check for UNIQUE categoryName

  console.log('req.body: ', req.body)

  // Save
  const category = new Category({
    categoryName: req.body.categoryName
  })

  category
    .save()
    .then(category => {
      res.json({
        success: true,
        data: category
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
