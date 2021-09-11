const express = require('express')
const router = express.Router()
const Product = require('../models/product')
import { Request, Response } from 'express'
const colors = require('colors/safe')

router.get(`/`, async (eq: Request, res: Response) => {
  try {
    const productList = await Product.find()
    res.send(productList)
  } catch (error) {
    console.log(colors.red(error))
    res.status(500).json({ success: false, message: error })
  }
})

router.post('/', async (req: Request, res: Response) => {
  const product = new Product({
    id: req.body.id,
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  })
  try {
    const createdProduct = await product.save()
    console.log(`createdProduct`, createdProduct)
    res.status(201).json(createdProduct)
    console.log(colors.inverse(`Success this product was created`, product))
  } catch (error) {
    res.status(500).json({ message: error, success: false })
    console.log(colors.red(error))
  }
})

module.exports = router
