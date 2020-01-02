require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const Person = require('./models/person')

const app = express()

app.use(express.static('build'))
app.use(bodyParser.json())
morgan.token('bodytiedot', function (req) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodytiedot'))
app.use(cors())

let persons = [
    { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
      },
      { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
      },
      { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
      },
      { 
        "name": "Mary Poppendieck", 
        "number": "39-23-64231221",
        "id": 4
      }
];

app.get('/', (req, res) => {
  res.send('<h1>Puhelinluettelo</h1>')
})

app.get('/info', (req, res, next) => {
    const aika = new Date();    
    Person.countDocuments({}, function (err, count) {
      res.send("Phonebook has " + count + " entries.<br>"+ aika);
    });
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(people => {
    response.json(people)
  })
  .catch(error => next(error))
  })

  app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person.toJSON())
      } else {
        response.status(404).end() 
      }
    })
    .catch(error => next(error))
  })

  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })

  app.post('/api/persons', (request, response) => {
    const id = Math.floor(Math.random() * 100000000);  
    const newName = request.body.name;
    const newNumber = request.body.number;
    if(!newName || !newNumber){
      console.log('POST name, number ',!newName, !newNumber);
      
      return response.status(400).json({
        error: 'Name and/or Number missing'
      })
    }
    //newPerson.id = id;
    //console.log(newPerson);

    /*const haku = persons.find(p => p.name === newName)
    if(haku){
      //console.log("if hakutulos: ", haku);
      
      return response.status(400).json({
        error: 'Name must be unique'
      })
    }*/
    const person = new Person({
      name: newName,
      number: newNumber
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson.toJSON())
    })
    
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson.toJSON())
      })
      .catch(error => next(error))
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
  app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})