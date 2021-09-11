const express = require('express')
const router = express.Router()
const Category = require('../models/category')
import { Request, Response } from 'express'
const colors = require('colors/safe')

router.get(`/`, async (eq: Request, res: Response) => {
  try {
    const categoryList = await Category.find()
    res.send(categoryList)
  } catch (error) {
    console.log(colors.red(error))
    res.status(500).json({ success: false, message: error })
  }
})

router.post('/', async (req: Request, res: Response) => {})

module.exports = router
