const mongoose = require('mongoose')

const businessSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'must provide name'],
    trim: true,
    maxlength: [20, 'name can not be more than 20 characters'],
  },
  password: {
    type: String,
    required: [true, 'must provide name'],
    maxlength: [20, 'name can not be more than 20 characters'],
  },
  wallet: {
    type: Number,
    default: 2000,
  },
}, { strict: 'throw' })

const businessModel = mongoose.model('Business', businessSchema);
module.exports = {businessModel};