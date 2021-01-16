const express = require('express')
const morgan = require('morgan')

const app = express()  


// Middlewares are functions which can be used to handle request and response objects in express)
// Middlewares are enabled like this: app.use(middleware)
// Middlewares are run in the order which they are enabled in the code (from top to bottom)
// Middlewares:
app.use(express.json()) // Takes the JSON data that came with the request, transforms it into an object and sets it as the body field of the request object
app.use(morgan('tiny')) // Logs HTTP requests


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

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})