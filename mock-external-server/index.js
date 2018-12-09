const express = require('express')
const bodyParser = require('body-parser')
const server = require('./server')

const app = express()

server(app)

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8095')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)

  next()
})

app.use(bodyParser.json({ limit: '50mb' }))

app.post('/mock-parser', (req, res) => {
  res.sendStatus(200)
})
