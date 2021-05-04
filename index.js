require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

morgan.token('body', req => {
  if (Object.keys(req.body).length) {
    return JSON.stringify(req.body);
  }
});

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons);
    })
    .catch(err => next(err));
});

app.get('/api/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        ${new Date()}
      `);
    })
    .catch(err => next(err));
});

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then(findPerson => {
      if (findPerson) {
        res.json(findPerson.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch(err => next(err));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(err => next(err));
});

app.put('/api/persons/:id', (req, res, next) => {
  const person = req.body;

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson);
    })
    .catch(err => next(err));
});

app.post('/api/persons', (req, res, next) => {
  const person = req.body;

  if (!person.name) {
    return res.status(400).json({error: 'name missing'});
  }

  if (!person.number) {
    return res.status(400).json({error: 'number missing'});
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
    .catch(err => next(err));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' });
  } 
  if (error.name === 'ValidationError') {
    return response.status(403).send({ error: error.message});
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});