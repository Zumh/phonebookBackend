
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const Person = require('./models/person')




// front-end build is included in the backend's root
app.use(express.static('dist'))

// cross origin resource sharing
app.use(cors())

// Creating new tokens
// stringify the token first
// we make sure morgan stringify the body before express server log using tiny configure.
morgan.token('body', function (req) { return JSON.stringify(req.body) })

// Format token inside morgan
// morgan is use before express json parser because we don't need json parser
// ":method :url :status :res[content-length] - :response-time ms" tiny config same as these tokens
// app.use(morgan('tiny')) // predefined format string
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


// we need to use json parser to object for manupilating data
app.use(express.json())

// this array is like a data that exist in a server
// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     },
//     { 
//       "id": 5,
//       "name": "John doe", 
//       "number": "12-43-234345"
//     }
// ]

app.get('/', (request, response) => {
    response.send('<h1>Lian Phonebook</h1>')
})

// response get request with persons data.
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })  
})

// show the time that the request was received 
 // how many entries are in the phonebook at the time of processing the request

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
  })
 
})


// find the person by id from request
// if found return person else return 404
app.get('/api/persons/:id', (request, response) => {
    // const id = Number(request.params.id)
    // const personFound = persons.find(person => person.id === id)
    
    // if (personFound) {
    //   response.json(personFound)
    // } else {
    //   response.status(404).end()
    // }

    Person.findById(request.params.id).then(person => {
      response.json(person)
    })
})


// delete the person by id
// if manage to delete return 204 else return 404
app.delete('/api/persons/:id', (request, response) => {
    // const id = Number(request.params.id)
    // persons = persons.filter(person => person.id !== id)
    // response.status(204).end()

    Person.findByIdAndDelete(request.params.id).then(person => {
      response.status(204).end()
    })
})



// generate the next id
const generateId = () => {

  return  Math.floor(Math.random() * Math.pow(persons.length, 2) )
}

app.post('/api/persons', (request, response) => {

  const body = request.body
  // if there is nothing in the body then response with error
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    })
  }  
  
  // check if any duplicate name exist in the list before adding new one
  Person.find({name: body.name}).then(person => {
    if (person.length > 0) {
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }
  })
  /*
  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }*/

 
  const person = new Person({
    name: body.name,
    number: body.number,
    id: generateId(),
  })

  
  //persons = persons.concat(person)

  // we are saving it in database and response after mongodb saved requested new data
  // and the express server response with the new person that just added in database
  person.save().then(savePerson => {
    response.json(savePerson)
  })
})

const PORT = process.env.PORT
//const PORT = process.env.PORT || 3001 // we need this for only when dotenv is not install in npm
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})