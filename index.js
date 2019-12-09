require('dotenv').config();
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', req => {
  if (Object.keys(req.body).length) {
    return JSON.stringify(req.body)
  }
})

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/info', (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    ${new Date()}
  `)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const contact = persons.find(person => person.id === id);
  if (contact) {
    res.json(contact)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const person = req.body;
  const createId = () => Math.floor(Math.random() * (999999 - 10)) + 10; //random integer from 10 to 999999
  
  if (!person.name) {
    return res.status(400).json({error: 'name missing'})
  }

  if (!person.number) {
    return res.status(400).json({error: 'number missing'})
  }

  if (persons.find(contact => contact.name === person.name)) {
    return res.status(400).json({error: 'name must be unique'})
  }

  persons = persons.concat({...person, id: createId()})
  return res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})