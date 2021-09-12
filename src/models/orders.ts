export {}
const mongoose = require('mongoose')

const ordersSchema = mongoose.Schema({
  orderItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderItem", required: true }],
  shippingAddress1: { type: String, required: true },
  shippingAddress2: { type: String, default: "" },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  Country: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, required: true, default: "Pending" },
  totalPrice: { type: Number },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  dateOrdered: { type: Date, default: Date.now },
});




ordersSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

ordersSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model('Orders', ordersSchema)
