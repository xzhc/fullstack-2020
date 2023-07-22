//对环境变量的处理
require('dotenv').config()

// eslint-disable-next-line no-undef, no-unused-vars
const PORT = process.env.PORT

// eslint-disable-next-line no-undef, no-unused-vars
const MONGODB_URI = process.env.NODE_ENV === 'test' ?
  process.env.TEST_MONGODB_URI : this.MONGODB_URI

module.exports = {
  PORT,
  MONGODB_URI
}