const mongoose = require('mongoose')

const creatorSchema = new mongoose.Schema({
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
    default: 0,
  },
  status: {
    type: String,
    enum: ['SPORT', 'BEAUTY', 'MUSIC', 'TECH', 'GAME'],
    default: 'SPORT'
  },
},  { strict: 'throw' })


const creatorModel = mongoose.model('Creators', creatorSchema);
module.exports = {creatorModel};