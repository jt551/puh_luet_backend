const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]


const url =
  `mongodb+srv://fullstack:${password}@cluster0-osc83.mongodb.net/puh-luettelo?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)


if ( process.argv.length === 3 ) {
  console.log('if clause password only ')
  Person.find({}).then(result => {
    result.forEach(contact => {
      console.log(contact.name + ' : '  + contact.number)
    })
    mongoose.connection.close()
  })
} else{
  console.log('else clause ! argv.length<4')
  const person = new Person({
    name: `${newName}`,
    number: `${newNumber}`
  })

  person.save().then( () => {
    console.log('contact saved!')
    mongoose.connection.close()
  })
}