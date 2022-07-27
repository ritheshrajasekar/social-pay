const { CustomError } = require('../error/customError')
const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }
  return res.status(500).json({ msg: 'Error, try again' })
}

module.exports = {errorHandlerMiddleware}