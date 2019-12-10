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

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons);
    })
    .catch(err => next(err))
})

app.get('/api/info', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        ${new Date()}
      `);
    })
  .catch(err => next(err))
})

// app.get('/api/persons/:id', (req, res) => {
//   const id = Number(req.params.id);
//   const contact = persons.find(person => person.id === id);
//   if (contact) {
//     res.json(contact)
//   } else {
//     res.status(404).end()
//   }
// })

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const person = req.body;

  if (!person.name) {
    return res.status(400).json({error: 'name missing'})
  }

  if (!person.number) {
    return res.status(400).json({error: 'number missing'})
  }
    
  const newPerson = new Person({
    name: person.name,
    number: person.number,
  });

  newPerson.save()
    .then(person => {
      console.log(`added ${person.name} number ${person.number} to phonebook`);
      res.json(person);
    })
    .catch(err => next(err))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})