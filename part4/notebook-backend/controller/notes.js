const jwt = require('jsonwebtoken')
const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')


//get all notes
notesRouter.get('/', async(request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  response.json(notes)
})

const getFromToken = request => {
  const authorization = request.get('authorization')

  if ( authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }

  return null
}

//get a note by its id
notesRouter.get('/:id', async(request, response) => {
  const note = await Note.findById(request.params.id)
  if ( note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

//create a new note
notesRouter.post('/',async (request, response) => {
  const body = request.body
  const token = getFromToken(request)
  const decodeToken = jwt.verify(token, process.env.SECRET)

  if ( !decodeToken.id) {
    return response.status(401).json( { error: 'token missing or invalid' })
  }
  const user = await User.findById(decodeToken.id)

  const note = new Note({
    content:body.content,
    date: new Date(),
    important: body.important || false,
    user: user._id
  })
  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()
  response.status(201).json(savedNote)
})

//delete a note by its id
notesRouter.delete('/:id', async(request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
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