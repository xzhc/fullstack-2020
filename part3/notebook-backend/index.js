const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const Note = require('./models/note')

const requestLogger = (request, response, next) => {
  console.log('Method', request.method)
  console.log('Path', request.Path)
  console.log('Body', request.body)
  console.log('----')

  next()
}

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if ( error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if ( error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json())
app.use(requestLogger)

//join a new note
app.post('/api/notes', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
    .catch(error => next(error))

})




//get root
app.get('/', (request, response) => {
  response.send('<h1>Hello World! </h1>')
})
//get all note
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})



// get a note by id
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id).then(note => {
    if ( note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})
//delete a note
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id).then(() => {
    response.status(204).end()
  })
    .catch(error => next(error))
})

//update a note
app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findByIdAndUpdate(request.params.id, { content, important }, { new: true, runValidators: true, context: 'query' })
    .then(updateNote => {
      response.json(updateNote)
    })
    .catch(error => next(error))
})


// handler of requests with unknown endpoint
app.use(unknownEndpoint)
app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
