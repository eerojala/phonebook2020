const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const entriesRouter = require('./controllers/entries')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

morgan.token('body', (request, response) =>  {
  // this function will be called in the :body -section of the format below
  return JSON.stringify(request.body) // displays the json data that come with the requests
})
// another example for morgan:
// morgan.token('method', (req, res) => {
//   // this function will be called in the :method -section of the format below
//   return 'Hello'
// })

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error while connecting to MongoDB:', error.message)
  })

// Middlewares are functions which can be used to handle request and response objects in node.js and express)
// Middlewares are enabled like this: app.use(middleware)
// Middlewares are run in the order which they are enabled in the code (from top to bottom)

// NOTE: The correct order of routes and middleware are very important
// 1. Regular middleware (internal order of these is also very important, for example express.json() should be one of the first middlewares to be used since we use request.body so much)
// 2. Regular routes
// 3. Routes which handle unknown endpoints (404)
// 4. Error handling middleware

// Middlewares:
// Allows to serve static files in the given directory (a middleware built into express, do not need to install separately)
// Using this express will first check if a file matching the given path in a GET-requests exists in the given directory, and then return it to the browser instead
app.use(express.static('build'))
app.use(express.json()) // Takes the JSON data that came with the request, transforms it into an object and sets it as the body field of the request object
app.use(cors()) // Allows requests from other origins (CORS), so axios (in the front-end) can get fetch data from this back-end
app.use(morgan(':method :url :status :response-time ms :body')) // Logs HTTP requests


// Regular routes:
app.use('/api/entries', entriesRouter)

// Unknown endpoint route:
app.use(middleware.unknownEndpoint)

// Error handling middleware
app.use(middleware.errorHandler)

module.exports = app