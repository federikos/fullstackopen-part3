const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://federikos:${password}@cluster0-hjopp.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (name && number) {
  const person = new Person({
    name,
    number,
  })
  
  person.save().then(res => {
    console.log(`added ${res.name} number ${res.number} to phonebook`);
    mongoose.connection.close();
  })
}

if (!name && !number) {
  Person.find({}).then(res => {
    console.log('phonebook:');
    res.forEach(person => console.log(`${person.name} ${person.number}`))
    mongoose.connection.close();
  })
}
