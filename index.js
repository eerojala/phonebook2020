const express = require('express')
const app = express()  // Takes the JSON data that came with the request, transforms it into an object and sets it as the body field of the request object

app.use(express.json())

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


// const generateId = () => {
//   const maxId = notes.length > 0
//   ? Math.max(...notes.map(n => n.id))
//   : 0

//   return maxId + 1
// }

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})