const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const { Worker } = require('worker_threads')
const server = require('./server')

const EXTERNAL_SERVER_URL = 'http://localhost:8095'

const app = express()

server(app)

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8093')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)

  next()
})

app.use('/data-processor-json', bodyParser.json({ limit: '50mb' }))
app.post('/data-processor-json', async (req, res) => {
  if (!req.body.data) {
    res.sendStatus(401)
  }

  const startTime = Date.now()

  for (let i = 0; i < req.body.data.length; i++) {
    try {
      await axios({
        method: 'post',
        url: `${EXTERNAL_SERVER_URL}/mock-parser`
      })
    } catch (err) {
      console.log({ err })
    }
  }

  res.status(200).send({
    ...process.memoryUsage(),
    endTime: Date.now(),
    startTime
  })
})

app.use('/data-processor-buffer', bodyParser.raw({ limit: '50mb' }))
app.post('/data-processor-buffer', async (req, res) => {
  const startTime = Date.now()
  let numProcessed = 0
  let totalNum = 0
  let data = ''
  let finishedLoading = false

  req.on('data', async chunk => {
    data += chunk.toString()

    const chunkArray = data.split('\n')

    data = chunkArray[chunkArray.length - 1]
    delete chunkArray[chunkArray.length - 1]

    totalNum += chunkArray.length

    for (let i = 0; i < chunkArray.length; i++) {
      try {
        await axios({
          method: 'post',
          url: `${EXTERNAL_SERVER_URL}/mock-parser`
        })
        numProcessed++
      } catch (err) {
        console.log({ err })
      }
    }

    console.log({ finishedLoading, numProcessed, totalNum })

    if (finishedLoading && numProcessed === totalNum) {
      res.status(200).send({
        ...process.memoryUsage(),
        endTime: Date.now(),
        startTime
      })
    }
  })

  req.on('end', async () => {
    finishedLoading = true
  })
})

app.use('/data-processor-threads', bodyParser.json({ limit: '50mb' }))
app.post('/data-processor-threads', async (req, res) => {
  if (!req.body.data) {
    res.sendStatus(401)
  }

  const startTime = Date.now()
  const numberOfWorkers = req.body.numThreads
  const numberRecordsPerWorker = req.body.data.length / numberOfWorkers
  let workersFinished = 0

  for (let i = 0; i < numberOfWorkers; i++) {
    const w = new Worker(`${__dirname}/worker.js`, {
      workerData: {
        data: req.body.data,
        start: numberRecordsPerWorker * i,
        end: (numberRecordsPerWorker * i) + numberRecordsPerWorker
      }
    })

    w.on('message', message => {
      if (message.done) {
        workersFinished++
      }

      console.log({ message })

      if (workersFinished === numberOfWorkers) {
        res.status(200).send({
          ...process.memoryUsage(),
          endTime: Date.now(),
          startTime
        })
      }
    })
  }
})
