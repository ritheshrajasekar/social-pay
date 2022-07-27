const express = require('express')
const businessRouter = express.Router()
const {createBusiness, updateWallet, getInfo, getDashboard} = require('../controllers/businessControllers')
const {authMiddleware} = require('../middlewares/authentication');

businessRouter.route('/').get(getDashboard)
businessRouter.route('/create').post(createBusiness);
businessRouter.route('/wallet').patch(authMiddleware, updateWallet)
businessRouter.route('/getInfo').get(authMiddleware, getInfo)


module.exports = {businessRouter};