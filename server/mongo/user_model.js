const mongoose = require('mongoose')

const Schema = mongoose.Schema

let UserSchema = new Schema({
  email: String,
  pass: String
})

let UserModel = mongoose.model('Users', UserSchema)

module.exports = UserModel
