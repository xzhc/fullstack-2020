const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const notesRouter = require('./controller/notes')
const usersRouter = require('./controller/users')
const loginRouter = require('./controller/lojin')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

//connnect to mongodb
logger.info('connecting to ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI).then(() => {
  logger.info('connected to mongodb')
})
  .catch((error) => {
    logger.error('error connected to mongodb', error.message)
  })

app.use(cors())

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app
