const express = require('express')
const router = express.Router()
const Category = require('../models/category')
import { Request, Response } from 'express'
const colors = require('colors/safe')




router.get(`/`, async (req: Request, res: Response) => {
  try {
    const categoryList = await Category.find()
    res.send(categoryList)
  } catch (error) {
    console.log(colors.red(error))
    res.status(500).json({ success: false, message: 'No categories found', error: error })
  }
})

router.get(`/:id`, async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const category = await Category.findById(id)
    res.send(category)
  } catch (error) {
    console.log(colors.red(error))
    res.status(500).json({ success: false, message: 'Category not found', error: error })
  }
})

router.post('/', async (req: Request, res: Response) => {
  const { name, icon, color } = req.body

  

  try {
    let category = new Category({ name, icon, color });
    const result = await category.save();
    if (result) {
      res.status(201).json({ result, success: true });
    }
  } catch (error) {
    res.status(404).json({
      message: "The category could not be created",
      success: false,
      error: error,
    });
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params

  console.log(`id`, id)
  try {
    const result = await Category.findByIdAndRemove(id)
    if (result) {
      res.status(200).json({ message: 'Category has been removed', success: true })
    }
  } catch (error) {
    res.status(404).json({
      message: 'The category could not be deleted please try again later',
      success: false,
      error: error,
    })
  }
})
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, icon, color } = req.body
  //   does name and icon color need error to checking
  try {
    const result = await Category.findByIdAndUpdate(
      id,
      {
        name,
        icon,
        color,
      },
      { new: true }
    )

    if (result) {
      res.status(200).json({ result, message: 'Category has been updated', success: true })
    }
  } catch (error) {
    res.status(404).json({
      message: 'The category could not be updated please try again later',
      success: false,
      error: error,
    })
  }
})

module.exports = router
