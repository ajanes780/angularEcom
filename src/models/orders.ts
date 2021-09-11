export {}
const mongoose = require('mongoose')

const ordersSchema = mongoose.Schema({})
ordersSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

ordersSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model('Orders', ordersSchema)
