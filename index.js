const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

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
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    ${new Date()}
  `)
})

app.get('/api/persons/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const contact = persons.find(person => person.id === id);
  if (contact) {
    res.json(contact)
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  const person = req.body;
  const createId = () => Math.round(Math.random() * (99999 - 10000) + 10000); //random integer from 10000 to 99999
  persons = persons.concat({...person, id: createId()})
})

const port = 3001
app.listen(port, () => {
  console.log(`server running on port ${port}`)
})