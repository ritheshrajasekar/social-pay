const {creatorModel} = require('../db/creatorModel')
const {businessModel} = require('../db/businessModel')
const {createCustomError} = require('../error/customError')
const path = require('path');
// const jwt = require('jsonwebtoken')
// const createCreator = asyncWrapper(async (req, res) => {
//     //check no business has same username as well
//     const exists = await creatorModel.findOne({ userName: req.body.userName })
//     if (exists) {
//         return next(createCustomError("username already exists", 400))
//     } 
//     const creator = await creatorModel.create(req.body)
//     res.status(201).json({ creator })
    
//   })

const createCreator = async (req, res) => {
  const exists = await creatorModel.findOne({ userName: req.body.userName })
  if (exists) {
      throw createCustomError("username already exists", 400)
  }
  const exists2 = await businessModel.findOne({ userName: req.body.userName })
  if (exists2) {
    throw createCustomError("username already exists", 400)
  }
  const creator = await creatorModel.create(req.body)
  res.status(201).json({ creator })
  
}

const updateWallet = async (req, res) => {
    const username = req.userName
    const initialCreator = await creatorModel.findOne({ userName: username })
    if (!initialCreator) {
        throw createCustomError("invalid creator wallet to update", 400)
    }
    
    const creator = await creatorModel.findOneAndUpdate({ userName: username }, 
        {wallet: Number(initialCreator.wallet) + Number(req.body.amount)}, {
        new: true,
        runValidators: true,
      })
    res.status(201).json({ creator })
    
  }

  const getInfo = async (req, res) => {
    const username = req.userName
    const creator = await creatorModel.findOne({ userName: username })
    if (!creator) {
        throw createCustomError("invalid creator", 400)
    }
    res.status(201).json({ userName: username, wallet: creator.wallet})

  }

  const creatorDashboard = async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/creator-dashboard.html'));
  } 



module.exports = {createCreator, updateWallet, getInfo, creatorDashboard}