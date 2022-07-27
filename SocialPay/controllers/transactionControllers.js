const {transactionModel} = require('../db/transactionModel')
const {businessModel} = require('../db/businessModel')
const {creatorModel} = require('../db/creatorModel')
const {createCustomError} = require('../error/customError')
const path = require('path');

const createTransaction = async (req, res) => {
    if (req.type == 'business') {
      req.body.businessUserName = req.userName
      const creator = await creatorModel.findOne({ userName: req.body.creatorUserName })
      if (!creator) {
        throw createCustomError("creator does not exist", 400);
      }
      const transaction = await transactionModel.create(req.body)
      const initialBusiness = await businessModel.findOne({ userName: req.userName })
      const newBusiness = await businessModel.findOneAndUpdate({ userName: req.userName }, 
        {wallet: Number(initialBusiness.wallet) - Number(req.body.amount)}, {
        new: true,
        runValidators: true,
      })
      res.status(201).json({ transaction })
    } else {
      throw createCustomError("not authorized to create transaction", 401)
    }
}

const updateTransaction = async (req, res) => {
    const { id } = req.params
    const userName = req.userName
    const initialTransaction = await transactionModel.findOne({ _id: id })
    if (!initialTransaction) {
        throw createCustomError("transaction doesn't exist", 400)
    }
    
    if (initialTransaction.creatorUserName != userName && initialTransaction.businessUserName != userName) {
      throw createCustomError("not authorized to update transaction", 401)
    }

    if (!req.body.urlProof || !req.body.creatorDescription) {
      //updated to either approve/reject transaction
      if (req.body.status == 'CANCELLED') {
        const initialBusiness = await businessModel.findOne({ userName: initialTransaction.businessUserName })
        const newBusiness = await businessModel.findOneAndUpdate({ userName: initialTransaction.businessUserName }, 
          {wallet: Number(initialBusiness.wallet) + Number(initialTransaction.amount)}, {
          new: true,
          runValidators: true,
        })
      }
    } else if (req.body.status == 'COMPLETE') {
      const initialCreator = await creatorModel.findOne({ userName: req.userName })
      const newCreator = await creatorModel.findOneAndUpdate({ userName: req.userName }, 
        {wallet: Number(initialCreator.wallet) + Number(initialTransaction.amount)}, {
        new: true,
        runValidators: true,
      })
    }
    const transaction = await transactionModel.findOneAndUpdate({ _id: id }, 
        req.body, {
        new: true,
        runValidators: true,
      })
    res.status(201).json({ transaction })
  }

const getAllTransactions = async (req, res) => {
  const transactions = await transactionModel.find({
    $or: [{creatorUserName: req.userName}, {businessUserName: req.userName}]
  })
  res.status(201).json({ transactions })
}

const getTransaction = async (req, res) => {
  const transaction = await transactionModel.findOne({
    $or: [{creatorUserName: req.userName}, {businessUserName: req.userName}],
    $and: [{ _id: req.params.id }]
  })

  if (!transaction) {
    throw createCustomError("transaction doesn't exist", 400)
  }

  res.status(201).json({ transaction: transaction, type: req.type })
}

const transactionBusinessDetails = async (req, res) => {
  res.sendFile(path.join(__dirname, '../public/transaction-details.html'));
}

const approveTransaction = async (req, res) => {
  res.sendFile(path.join(__dirname, '../public/creator-approve.html'));
}

const creatorInvoice = async (req, res) => {
  res.sendFile(path.join(__dirname, '../public/creator-invoice.html'));
}

const searchTransactions = async (req, res) => {
  res.sendFile(path.join(__dirname, '../public/search-transactions.html'));
}

const apiDocumentation = async (req, res) => {
  res.sendFile(path.join(__dirname, '../public/api-documentation.html'));
}


module.exports = {createTransaction, updateTransaction, getAllTransactions, getTransaction, transactionBusinessDetails, approveTransaction, creatorInvoice, searchTransactions, apiDocumentation}