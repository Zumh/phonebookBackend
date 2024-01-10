const express = require('express')
const app = express()

// this array is like a data that exist in a server
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

app.get('/', (request, response) => {
    response.send('<h1>Lian Phonebook</h1>')
})

// response get request with persons data.
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// show the time that the request was received 
 // how many entries are in the phonebook at the time of processing the request

app.get('/info', (request, response) => {
    
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
    
})


// find the person by id from request
// if found return person else return 404
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const personFound = persons.find(person => person.id === id)
    
    if (personFound) {
      response.json(personFound)
    } else {
      response.status(404).end()
    }
})

// delete the person by id
// if manage to delete return 204 else return 404
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})


const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)