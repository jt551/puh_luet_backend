const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const bodyParser = require('body-parser')

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

app.get('/info', (req, res) => {
    const aika = new Date();
    res.send("Phonebook has " + persons.length + " entries.<br>"+ aika);
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  app.post('/api/persons', (request, response) => {
    const id = Math.floor(Math.random() * 100000000);  
    const newPerson = request.body;
    if(!newPerson.name || !newPerson.number){
      //console.log(!newPerson.name, !newPerson.number);
      
      return response.status(400).json({
        error: 'Name and/or Number missing'
      })
    }
    newPerson.id = id;
    //console.log(newPerson);

    const haku = persons.find(p => p.name === newPerson.name)
    if(haku){
      //console.log("if hakutulos: ", haku);
      
      return response.status(400).json({
        error: 'Name must be unique'
      })
    }
    

    persons = persons.concat(newPerson)  
    response.json(newPerson)
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})