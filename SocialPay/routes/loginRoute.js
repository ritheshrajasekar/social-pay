const express = require('express')
const loginRouter = express.Router()
const {login, getType, getLogin} = require('../controllers/loginController')
const {authMiddleware} = require('../middlewares/authentication');


loginRouter.route('/').post(login).get(getLogin);
loginRouter.route('/type').get(authMiddleware, getType);



module.exports = {loginRouter};