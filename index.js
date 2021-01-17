const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('body', (req, res) =>  {
  // this function will be called in the :body -section of the format below
  return JSON.stringify(req.body) // displays the json data that come with the requests
})

// morgan.token('method', (req, res) => {
//   // this function will be called in the :method -section of the format below
//   return 'Hello'
// })

const app = express()  

// Middlewares are functions which can be used to handle request and response objects in node.js and express)
// Middlewares are enabled like this: app.use(middleware)
// Middlewares are run in the order which they are enabled in the code (from top to bottom)
// Middlewares:
app.use(express.static('build')) // Allows to serve static files in the given directory (a middleware built into express, do not need to install separately)
                                 // Using this express will first check if a file matching the given path in a GET-requests exists in the given directory, and then return it to the browser instead
app.use(cors()) // Allows requests from other origins (CORS), so axios can get fetch data from the front-end
app.use(express.json()) // Takes the JSON data that came with the request, transforms it into an object and sets it as the body field of the request object
app.use(morgan(':method :url :status :response-time ms :body')) // Logs HTTP requests


let entries = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6434122"
  }
]

app.get('/info', (request, response) => {
  return response.send(`<p>Phonebook has info for ${entries.length} people</p><br><p>${new Date()}</p>`)
})

app.get('/api/entries', (request, response) => {
  return response.json(entries)
})

app.get('/api/entries/:id', (request, response) => {
  const id = Number(request.params.id)
  const entry = entries.find(e => e.id === id)

  if (entry) {
    return response.json(entry)
  } else {
    return response.status(404).end()
  }
})

app.delete('/api/entries/:id', (request, response) => {
  const id = Number(request.params.id)
  entries = entries.filter(e => e.id !== id)

  return response.status(204).end()
})

app.post('/api/entries', (request, response) => {
  const id = Math.floor(Math.random() * 10000)
  const newEntry = request.body

  if (JSON.stringify(newEntry) === JSON.stringify({})) {
    // empty object
    return response.status(400).json({
      error: 'empty object'
    })
  }

  if (!newEntry.name || !newEntry.number) {
    return response.status(400).json({
      error: 'missing fields'
    })
  }

  if (entries.find(e => e.name === newEntry.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  newEntry.id = id
  entries = entries.concat(newEntry)

  return response.json(newEntry)
})

const PORT = process.env.PORT || 3001 // assigns the port number from an environment variable or if it does not exist, then 3001 as default
                                      // heroku has a PORT environment variable automatically
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})