const express = require('express')

const app = express()
app.use(express.json())

let persons = [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

//Phonebook backend step1 
app.get('/api/persons', (request, response) =>{
    response.json(persons)
})

//Phonebook backend step2
app.get('/info', (request, response) => {
    response.send(`<div>Phonebook has info for ${persons.length} people</div>
    <div>${new Date()}</div>`)
})

//Phonebook backend step3
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

//Phonebook backend step4
app.delete('/api/persons/:id',(request, response) =>{
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

//Phonebook backend step5
const generateId = () => {
    const id = Math.random(10000)
    return id
}

app.post('/api/persons',(request, response) =>{
    const body = request.body
    //检查姓名或者号码是否存在
    if ( !body.name || !body.number) {
        return response.status(400).json({error: 'name or numer is missing'})
    }
    //检查姓名是否存在于电话本中
    const existingPerson = persons.find(person => person.name === body.name)
    if ( existingPerson) {
        return response.status(400).json({error: 'name must be unique'})
    }
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})