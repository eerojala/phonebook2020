require('dotenv').config() // library that loads environment variables from the file .env (NOTE: REMEMBER TO GITIGNORE IT)
                           // also remember to require dotenv before requiring models, so we can be sure that the database link can be read correctly

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('body', (req, res) =>  {
  // this function will be called in the :body -section of the format below
  return JSON.stringify(req.body) // displays the json data that come with the requests
})

// another example for morgan:
// morgan.token('method', (req, res) => {
//   // this function will be called in the :method -section of the format below
//   return 'Hello'
// })

const app = express()  


// Middlewares are functions which can be used to handle request and response objects in node.js and express)
// Middlewares are enabled like this: app.use(middleware)
// Middlewares are run in the order which they are enabled in the code (from top to bottom)

// NOTE: The correct order of routes and middleware are very important 
// 1. Regular middleware (internal order of these is also very important, for example express.json() should be one of the first middlewares to be used since we use request.body so much)
// 2. Regular routes
// 3. Routes which handle unknown endpoints (404)
// 4. Error handling middleware

// Middlewares:
app.use(express.static('build')) // Allows to serve static files in the given directory (a middleware built into express, do not need to install separately)
                                 // Using this express will first check if a file matching the given path in a GET-requests exists in the given directory, and then return it to the browser instead
                                 
app.use(express.json()) // Takes the JSON data that came with the request, transforms it into an object and sets it as the body field of the request object                          
app.use(cors()) // Allows requests from other origins (CORS), so axios (in the front-end) can get fetch data from this back-end
app.use(morgan(':method :url :status :response-time ms :body')) // Logs HTTP requests

// Models
const Entry = require('./models/entry.js')

app.get('/info', (request, response) => {
  Entry.find({}).then(entries => {
    response.send(`<p>Phonebook has info for ${entries.length} people</p><br><p>${new Date()}</p>`)
  })
})

app.get('/api/entries', (request, response, next) => {
  Entry.find({}).then(entries => {
    response.json(entries)
  })
  .catch(error => next(error))
})

app.get('/api/entries/:id', (request, response, next) => {
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

app.delete('/api/entries/:id', (request, response, next) => {
  Entry.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/entries', (request, response, next) => {
  // const id = Math.floor(Math.random() * 10000)
  // const newEntry = request.body

  const body = request.body

  if (JSON.stringify(body) === JSON.stringify({})) {
    // empty object
    return response.status(400).json({
      error: 'empty object'
    })
  }

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'missing fields'
    })
  }

  // if (entries.find(e => e.name === body.name)) {
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }

  const entry = new Entry({
    name: body.name,
    number: body.number
  })

  entry.save()
    .then(savedEntry => {
      return response.json(savedEntry)
    })
    .catch(error => next(error))
})

app.put('/api/entries/:id', (request, response, next) => {
  const body = request.body

  const entry = {
    name: body.name,
    number: body.number
  }

  // by default findByIdAndUpdate returns the _previous_ state of the updated object (before changes)
  // by using the parameter new:true it will return the current updated state instead
  Entry.findByIdAndUpdate(request.params.id, entry, { new: true }) 
    .then(updatedEntry => {
      response.json(updatedEntry)
    })
    .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    // given id does not match the format of a MongoDB id
    return response.status(400).send({ error: 'malformatted id' })
  }
}

app.use(errorHandler)


const PORT = process.env.PORT // assigns the port number from an environment variable (heroku has a PORT environment variable automatically)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})