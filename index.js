
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
app.get('/api/persons/:id', (request, response, next) => {

    Person.findById(request.params.id).then(person => {
      if (person) {
        
        response.json(person)        
      } else {

        // if a person not found in a phone book then return 404
        //response.status(404).end()
        next(unknownEndpoint)
      }
    })
    .catch(error => next(error)) // continue to error handler middleware
})

// make small changes to existing data in mongoDB
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number
  }
  // we make new fresh object and added to mongoDB instead of making changes to old one.
  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      // reponse back to client with updated person
      

      response.json(updatedPerson)
    })
    .catch(error => {
      console.log("Error occured", error)

      next(error)}) // if error occcur for Casterror then execute next middleware error
})


// delete the person by id
// if manage to delete return 204 else return 404
app.delete('/api/persons/:id', (request, response, next) => {

    Person.findByIdAndDelete(request.params.id).then(person => {
        response.status(204).end()
    }) .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {

  const body = request.body
  // if there is nothing in the body then response with error
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    })
  }  
  

  const person = new Person({
    name: body.name,
    number: body.number,
  })


  // we are saving it in database and response after mongodb saved requested new data
  // and the express server response with the new person that just added in database
  person.save().then(savePerson => {
    response.json(savePerson)
  }).catch(error => next(error))
})



const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


// handler of requests with unknown endpoint
app.use(unknownEndpoint)


// error handler middle ware
//  if the error is a CastError exception it will handle otherwise passed it own to Express error handler
const errorHandler = (error, request, response, next) => {

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'invalid id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// load this midlleware the the last
app.use(errorHandler)

const PORT = process.env.PORT
//const PORT = process.env.PORT || 3001 // we need this for only when dotenv is not install in npm
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})