const {creatorModel} = require('../db/creatorModel')
const {businessModel} = require('../db/businessModel')
const {createCustomError} = require('../error/customError')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'helloworld'

const authMiddleware = async (req, res, next) => {
    let authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createCustomError('No token provided', 401)
    }
    
    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.userName = decoded.userName
        req.type = decoded.type
        next()
      } catch (error) {
        throw createCustomError('Unauthorized request', 401)
      }
    
    
}

module.exports = {authMiddleware}