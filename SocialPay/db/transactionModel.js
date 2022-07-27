const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  creatorUserName: {
    type: String,
    required: [true, 'must provide creator name'],
  },
  businessUserName: {
    type: String,
    required: [true, 'must provide business name '],
  },
  businessDescription: {
    type: String,
    required: [true, 'must provide description'],
  },
  amount: {
    type: Number,
    required: [true, 'must provide amount'],
  },
  initialDate: {
    type: Date,
    default: Date.now(),
  },
  expiryDate: {
    type: Date,
    required: [true, 'must provide a date'],
  },

  //add image proof later if needed

  urlProof: {
    type: String,
    required: [false],
    default: null,
  },
  approvedDate: {
    type: Date,
    required: [false],
    default: null,
  },
  creatorDescription: {
    type: String,
    required: [false],
    default: null,
  },
  status: {
    type: String,
    enum: ['CANCELLED', 'PENDING', 'COMPLETE', 'AWAITING_APPROVAL'],
    default: 'AWAITING_APPROVAL'
  },
  engagementRate: {
    type: Number,
    required: [false],
    default: null,
  },
  category: {
    type: String,
    enum: ['SPORT', 'LIFESTYLE', 'GAME', 'TECH', 'MUSIC'],
    default: null, 
  },
  platform: {
    type: String,
    enum: ['YOUTUBE', 'TWITCH', 'INSTAGRAM', 'TIKTOK', 'FACEBOOK'],
    default: null,
  },
}, { strict: 'throw' })


const transactionModel = mongoose.model('Transaction', transactionSchema);
module.exports = {transactionModel};