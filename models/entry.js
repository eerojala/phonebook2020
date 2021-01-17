const mongoose = require('mongoose')

const url = process.env.MONGODB_URI // NEVER save database credientals into code

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('Successfully connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB: ', error.message)
  })

  const entrySchema = new mongoose.Schema({
    name: String,
    number: String
  })

  entrySchema.set('toJSON', { // this is done so id is returned in field 'id' instead of '_id'
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Entry', entrySchema)