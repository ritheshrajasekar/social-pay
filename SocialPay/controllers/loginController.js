const {creatorModel} = require('../db/creatorModel')
const {businessModel} = require('../db/businessModel')
const {createCustomError} = require('../error/customError')
const jwt = require('jsonwebtoken')
const path = require('path');

//change to environment var later
const JWT_SECRET = 'helloworld'

const login = async (req, res) => {
    const creator = await creatorModel.findOne({ userName: req.body.userName, password: req.body.password })
    if (creator) {
        const token = jwt.sign({ userName: creator.userName, type: 'creator'}, JWT_SECRET, {
            expiresIn: '1d',
          })
        return res.status(200).json({token: token, type: "creator"});
    } else {
        const business = await businessModel.findOne({ userName: req.body.userName, password: req.body.password })
        if (business) {
            const token = jwt.sign({ userName: business.userName, type: 'business' }, JWT_SECRET, {
                expiresIn: '1d',
              })
            return res.status(200).json({token: token, type: "business"});
        }
    }
    throw createCustomError("invalid username and password", 401)
}

const getType = async (req, res) => {
    return res.status(200).json(req.type); 
}

const getLogin = async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/log-in.html'));
}

module.exports = {login, getType, getLogin}