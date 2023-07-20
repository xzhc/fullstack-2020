const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
