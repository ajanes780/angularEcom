export {}
const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
  id: Number,
  name: String,
  image: String,
  countInStock: Number,
})
module.exports = mongoose.model('Product', productSchema)
