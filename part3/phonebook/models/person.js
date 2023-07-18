const mongoose = require('mongoose')


// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url).then(() => {
  console.log('connected to MongoDB')
}).catch((error) => {
  console.log('error connected to MongoDB', error.message)
})

const numberValidators = [
  {
    //Minimum length validator
    validator: (number) => {
      if ( (number[2] === '-' || number[3] === '-') && number.length >= 9) {
        return true
      }
      return false
    },
    msg: 'must be at least 8 digits'
  },
  {
    //Regex validator to allow only numbers
    validator: (number) => {
      return /^\d{2,3}-\d+$/.test(number)
    },
    msg: 'invalid phone number'
  },
]

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: numberValidators,
    requireed: true
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)