require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const colors = require('colors/safe')
const api = process.env.API_URL
const app = express()

// middleware
app.use(express.json())
app.use(morgan('tiny'))


const productSchema = mongoose.Schema({
  id: Number,
  name: String,
  image: String,
  countInStock: Number,
})

const Product = mongoose.model('Product', productSchema)
// routes
app.get(`${api}/products`, async (req, res) => {
  const productList = await Product.find()
  if (!productList) {
    res.status(500).json({ success: false })
  }
  res.send(productList)
})

app.post(`${api}/products`, async (req, res) => {
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

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@angularstore.irh8h.mongodb.net/angularStore?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log(colors.rainbow('MongoDB is now connected'))
  })
  .catch((e) => {
    console.log(colors.red(` There has been a database error ${e}`))
  })
  
app.listen(3000, () => {
  console.log(colors.random('Server is running on port 3000'))
})
