const express = require('express')
const creatorRouter = express.Router()
const {example, createCreator, updateWallet, getInfo, creatorDashboard} = require('../controllers/creatorControllers')
const {authMiddleware} = require('../middlewares/authentication');

creatorRouter.route('/').get(creatorDashboard)
creatorRouter.route('/create').post(createCreator);
creatorRouter.route('/wallet').patch(authMiddleware, updateWallet);
creatorRouter.route('/getInfo').get(authMiddleware, getInfo);


module.exports = {creatorRouter};