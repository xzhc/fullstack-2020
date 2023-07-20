//打印工作分离
const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.log(...params)
}

module.exports = {
  info,
  error
}