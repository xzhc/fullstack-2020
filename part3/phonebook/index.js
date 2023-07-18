const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()

const Person = require('./models/person')

const requestLogger = (request, response, next) => {
  console.log('Method', request.method)
  console.log('Path', request.path)
  console.log('Body', request.body)
  console.log('-----')

  next()
}

const errorHandler = (error,request, response, next) => {
  console.log(error.message)
  if ( error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if ( error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  return response.status(404).send({ error: 'unknown Endpoint' })
}

app.use(express.json())
app.use(cors())
app.use(requestLogger)
//Phonebook backend step7
const morgan = require('morgan')
app.use(morgan('tiny'))
//Phonebook backend step8
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

let persons = []

//Phonebook backend step1
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

//Phonebook backend step2
app.get('/info', (request, response, next) => {
  Person.find({}).then((people) => {
    response.send(
      `<p>Phonebook has info for ${people.length} people </p><p>${new Date()}</p>`
    )
  })
    .catch(error => next(error))
})

//Phonebook backend step3
app.get('/api/persons/:id', (request, response,next) => {
  Person.findById(request.params.id).then(person => {
    if ( person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

//Phonebook backend step4(delete)
app.delete('/api/persons/:id',(request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(() => {
    response.status(204).end()
  })
    .catch(error => next(error))
})


//Phonebook backend step5 and step6


app.post('/api/persons',(request, response, next) => {
  const body = request.body
  //检查姓名或者号码是否存在
  if ( !body.name || !body.number) {
    return response.status(400).json({ error: 'name or numer is missing' })
  }
  //检查姓名是否存在于电话本中
  const existingPerson = persons.find(person => person.name === body.name)
  if ( existingPerson) {
    return response.status(400).json({ error: 'name must be unique' })
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPserson => {
    response.json(savedPserson)
  })
    .catch(error => next(error))
})

//Phonebook database, step5
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' }).then(updatePerson => {
    response.json(updatePerson)
  })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})