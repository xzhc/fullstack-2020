const User = require('../models/user')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  logger.info('Method', request.method)
  logger.info('Path', request.Path)
  logger.info('Body', request.body)
  logger.info('----')

  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  if ( error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if ( error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  } else if ( error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: 'invalid token' })
  } else if ( error.name === 'TokenExpiredError') {
    return response.status(400).json({ error: 'token expired' })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
//中间件函数用于验证令牌
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if ( authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const token = request.token
  if (token) {
    try {
      const decodeToken = jwt.verify(token, process.env.SECRET)
      console.log('Decoded Token:', decodeToken)
      const user = await User.findById(decodeToken.id)
      console.log('User:', user)

      if (!user) {
        return response.status(401).json({ error: 'user not found' })
      }

      request.user = user
    } catch (error) {
      console.error('Token Decoding Error:', error.message)
      return response.status(401).json({ error: 'invalid token' })
    }
  } else {
    return response.status(401).json({ error: 'token missing' })
  }

  next()
}

module.exports = {
  requestLogger,
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
  userExtractor
}