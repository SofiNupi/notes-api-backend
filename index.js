const express = require('express')
const cors = require('cors')

const app = express()
const logger = require('./loggerMiddleware')




app.use(express.json());
// const app = http.createServer((request, response) => {
//     response.writeHead(200, { 'Content-Type': 'text/plain' })
//     response.end('Hello World')
// })

app.use(logger);

let notes = [
    {
        id: 1,
        content: 'pedo',
    },
    {
        id: 2,
        content: 'pedorro',
    },
    {
        id: 3,
        content: 'pedorrina',
    }
]

app.get('/', (request,response) => {
    response.send('<h1> Hello world </>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes);
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find(note => note.id === id);
    if (note) { 
        response.json(note)
    } else {
        response.status(404).end();
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    notes = notes.filter(note => note.id !== id)
    response.status(204).end();
})


app.post('/api/notes', (request, response) => {
    const note = request.body;

    if (!note || !note.content) {
        return response.status('400').json({
            error: 'note.content is missing';
        })
    }

    const ids = notes.map(note => note.id);
    const maxId = Math.max(...ids);

    const newNote = {
        id: maxId +1,
        content: note.content,
        important: typeof note.important !== undefined ? note.important : false,
        date: new Date().toISOString()
    }

    notes = [...notes, newNote]; 

    response.status(201).json(newNote);
})


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});