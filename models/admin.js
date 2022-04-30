const mongoose = require('mongoose'),
  { Schema } = mongoose

const adminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  role: [{ type: String, ref: 'role' }],
  permit: [{ type: String, ref: 'permit' }],
})

const admin = mongoose.model('admin', adminSchema)

module.exports = admin
