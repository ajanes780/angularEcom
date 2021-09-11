export {}
const mongoose = require('mongoose')

const usersSchema = mongoose.Schema({})

 usersSchema.virtual("id").get(function () {
   return this._id.toHexString();
 });

 usersSchema.set("toJSON", {
   virtuals: true,
 });
module.exports = mongoose.model('Users', usersSchema)
