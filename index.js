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

app.get('/info', (request, response) => {
    //  show the time that the request was received 
    
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
    // how many entries are in the phonebook at the time of processing the request

    
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)