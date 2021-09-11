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

// routes
app.get(`${api}/products`, (req, res) => {
  const product = {
    id: 1,
    name: 'string',
    url: 'nome_url',
  }
  res.send(product)
})

app.post(`${api}/products`, (req, res) => {
  const newProduct = req.body

  console.log(`newProduct`, newProduct)
  res.send('Hello World')
})

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@angularstore.irh8h.mongodb.net/angularstore?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log(colors.rainbow('MongoDb Connected'))
  })
app.listen(3000, () => {
  console.log(colors.random('Server is running on port 3000'))
})
