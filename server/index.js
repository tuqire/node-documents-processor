const express = require('express')
const app = express()
const server = require('./server')

server(app)

app.get('/', (req, res) => {
  res.send('Hello World!')
})
