const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://eerojala:${password}@cluster0.6xrma.mongodb.net/phonebook2020?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const entrySchema = new mongoose.Schema({
  name: String,
  number: String
})

const Entry = mongoose.model('Entry', entrySchema)

if (process.argv.length === 3) {
  console.log("Phonebook:")
  Entry.find({}).then(result => {
    result.forEach(entry => {
      console.log(`${entry.name} ${entry.number}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const entry = new Entry({
    name: process.argv[3],
    number: process.argv[4]
  })

  entry.save().then(response => {
    console.log(`Added ${entry.name} number ${entry.number} to phonebook`)
    mongoose.connection.close()
  })
}

// NOTE: do not put mongoose.connection.close() here. The code will be run all they way here and the connection will close before the .then callback functions are ran