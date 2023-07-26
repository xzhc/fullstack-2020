const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('../tests/test_helper')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/note')

beforeEach(async() => {
  await Note.deleteMany({})
  await Note.insertMany(helper.initialNotes)
}, 10000)

describe('when there is initially some notes saved', () => {

  test('notes are returned as json', async() => {
    console.log('entered test')
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-type', /application\/json/)
  }, 10000)

  test('all notes are returned', async() => {
    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(helper.initialNotes.length)
  }, 10000)

  test('a special note is within the returned notes', async() => {
    const response = await api.get('/api/notes')
    const contents = response.body.map(r => r.content)
    expect(contents).toContain('Browser can execute only Javascript')
  }, 10000)
})

describe('viewing a specific note', () => {
  test('succeed with a valid id', async () => {
    const noteAtStart = await helper.notesInDb()

    const noteToView = noteAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedNotetoView = JSON.parse(JSON.stringify(noteToView))

    expect(resultNote.body).toEqual(processedNotetoView)
  })

  test('fails with statuscode 404 if note does note exists', async () => {
    const validNonexistingId = await helper.noExistingId()

    console.log(validNonexistingId)

    await api
      .get(`/api/notes/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/notes/${invalidId}`)
      .expect(400)
  })
})

describe('addition of a new note', () => {
  test('a valid note can be added', async() => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true
    }
    await api
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-type',/application\/json/)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

    const contents = notesAtEnd.map(n => n.content)

    expect(contents).toContain(
      'async/await simplifies making async calls'
    )
  })

  test('note without content is not added', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
  }, 10000)
})

describe('deletion of a note', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const noteAtStart = await helper.notesInDb()
    const noteToDelete = noteAtStart[0]

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1)

    const contents = notesAtEnd.map(r => r.content)
    expect(contents).not.toContain(noteToDelete.content)
  })
})

afterAll(() => {
  mongoose.connection.close()
})