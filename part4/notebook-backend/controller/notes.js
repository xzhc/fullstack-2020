const notesRouter = require('express').Router()
const Note = require('../models/note')


//get all notes
notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

//get a note by its id
notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id).then(note => {
    if ( note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

//create a new note
notesRouter.post('/',(request, response, next) => {
  const body = request.body

  const note = new Note({
    content:body.content,
    date: new Date(),
    important: body.important || false
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
    .catch(error => next(error))
})

//delete a note by its id
notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id).then(() => {
    response.status(204).end()
  })
    .catch(error => next(error))
})

//update a note
notesRouter.put('/:id', (request, response, next) => {
  const body = request.body
  const note = {
    content: body.content,
    important: body.important
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true }).then(updateNote => {
    response.json(updateNote)
  })
    .catch(error => next(error))
})

module.exports = notesRouter