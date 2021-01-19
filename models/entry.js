const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const entrySchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    minLength: 8,
    required: true
  }
})

entrySchema.plugin(uniqueValidator)

entrySchema.set('toJSON', { // this is done so id is returned in field 'id' instead of '_id'
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Entry', entrySchema)