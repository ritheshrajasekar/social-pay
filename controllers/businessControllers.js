const {businessModel} = require('../db/businessModel')
const {creatorModel} = require('../db/creatorModel')
const {createCustomError} = require('../error/customError')
const path = require('path');

const createBusiness = async (req, res) => {
    const exists = await businessModel.findOne({ userName: req.body.userName })
    if (exists) {
        throw createCustomError("username already exists", 400)
    }
    const exists2 = await creatorModel.findOne({ userName: req.body.userName })
    if (exists2) {
        throw createCustomError("username already exists", 400)
    } 
    const business = await businessModel.create(req.body)
    res.status(201).json({ business }) 
  }

  const updateWallet = async (req, res) => {
    const username = req.userName
    const initialBusiness = await businessModel.findOne({ userName: username })
    if (!initialBusiness) {
        throw createCustomError("invalid business wallet to update", 400)
    }
    
    const business = await businessModel.findOneAndUpdate({ userName: username }, 
        {wallet: Number(initialBusiness.wallet) - Number(req.body.amount)}, {
        new: true,
        runValidators: true,
      })
    res.status(201).json({ business })
  }

  const getInfo = async (req, res) => {
    const username = req.userName
    const business = await businessModel.findOne({ userName: username })
    if (!business) {
        throw createCustomError("invalid business", 400)
    }
    const data = {userName: username, wallet: business.wallet}
    res.status(201).json(data)
  }

  const getDashboard = async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/business-dashboard.html'));
  } 

  module.exports = {createBusiness,updateWallet, getInfo, getDashboard}