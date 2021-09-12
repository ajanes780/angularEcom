export {}
const mongoose = require('mongoose')

const usersSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, default: "" },
  isAdmin: { type: Boolean, required: true, default: false },
  street: { type: String, default: "" },
  apartment: { type: String, default: "" },
  city: { type: String, default: "" },
  postalCode: { type: String, default: "" },
  country: { type: String, default: "" },
});

usersSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

usersSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model('Users', usersSchema)
