const express = require('express')
const transactionRouter = express.Router()
const {createTransaction, updateTransaction, getAllTransactions, getTransaction, transactionBusinessDetails} = require('../controllers/transactionControllers')
const {authMiddleware} = require('../middlewares/authentication');


transactionRouter.route('/').get(transactionBusinessDetails)
transactionRouter.route('/create').post(authMiddleware, createTransaction);
transactionRouter.route('/update/:id').patch(authMiddleware, updateTransaction);
transactionRouter.route('/getAll').get(authMiddleware, getAllTransactions);
transactionRouter.route('/get/:id').get(authMiddleware, getTransaction);


module.exports = {transactionRouter};