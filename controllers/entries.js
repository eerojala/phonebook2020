const entriesRouter = require('express').Router()
const Entry = require('../models/entry')

entriesRouter.post('', (request, response, next) => {
  const body = request.body

  const entry = new Entry({
    name: body.name,
    number: body.number
  })

  // chaining promises like this is good when there are multiple asynchronous operations
  // entry.save() // returns a promise with the saved entry
  //   .then(savedEntry => savedEntry.toJSON()) // returns returns a promise with the formatted entry
  //   .then(savedAndFormattedEntry => {
  //     return response.json(savedAndFormattedEntry)
  //   })
  //   .catch(error => next(error))

  entry.save() // in our case this is fine though
    .then(savedEntry => {
      return response.json(savedEntry)
    })
    .catch(error => next(error))
})

entriesRouter.get('', (request, response, next) => {
  Entry.find({})
    .then(entries => {
      response.json(entries)
    })
    .catch(error => next(error))
})

entriesRouter.get('/:id', (request, response, next) => {
  Entry.findById(request.params.id)
    .then(entry => {
      if (entry) {
        response.json(entry)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
    // without a parameter, function next() ignores this route and transfer to the next route/middleware
    // with a parameter, function next(parameter) will transfer to an error-handling middleware

  // example of non-middleware error handling
  // .catch(error => {
  //   // given id does not match the format of MongoDB ids.
  //   console.log(error)
  //   response.status(400).send({ error: 'malformatted id' })
  // })
})

entriesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const entry = {
    name: body.name,
    number: body.number
  }

  // by default findByIdAndUpdate returns the _previous_ state of the updated object (before changes)
  // by using the parameter new:true it will return the current updated state instead
  // As of now updating an entry does not run validators, so an entry can be updated with an invalid name or number, to change this, add runValidators:true to options
  Entry.findByIdAndUpdate(request.params.id, entry, { new: true })
    .then(updatedEntry => {
      response.json(updatedEntry)
    })
    .catch(error => next(error))
})

entriesRouter.delete('/:id', (request, response, next) => {
  Entry.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

module.exports = entriesRouter