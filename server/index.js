const express = require('express')
const bodyParser = require('body-parser')
const { Worker } = require('worker_threads')
const server = require('./server')
const dataProcessor = require('./data-processor')

const app = express()

server(app)

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8093')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)

  next()
})

app.use('/data-processor-json', bodyParser.json({ limit: '500mb' }))
app.post('/data-processor-json', async (req, res) => {
  const startTime = Date.now()

  const { data, numProcessed } = await dataProcessor(req.body.data)

  res.status(200).send({
    ...process.memoryUsage(),
    endTime: Date.now(),
    startTime,
    data,
    numProcessed
  })
})

app.use('/data-processor-buffer', bodyParser.raw({ limit: '500mb' }))
app.post('/data-processor-buffer', async (req, res) => {
  const startTime = Date.now()
  let numProcessed = 0
  let totalNum = 0
  let finished = false
  let buffer = ''
  let data = []

  req.on('data', async chunk => {
    buffer += chunk.toString()

    const chunkArray = buffer.split('\n')

    buffer = chunkArray[chunkArray.length - 1]

    chunkArray.pop()

    totalNum += chunkArray.length

    // for (let i = 0; i < bufferArray.length; i++) {
    //   if (!bufferArray[i]) {
    //     delete bufferArray[i]
    //   }
    // }

    const chunkJSON = JSON.parse(`{ "data": [${chunkArray.join(',')}] }`).data

    const { data: _data, numProcessed: _numProcessed } = await dataProcessor(chunkJSON)

    numProcessed += _numProcessed

    data.push(_data)

    console.log({ finished, _numProcessed, numProcessed, totalNum })

    if (finished && numProcessed === totalNum) {
      res.status(200).send({
        ...process.memoryUsage(),
        endTime: Date.now(),
        startTime,
        data,
        numProcessed
      })
    }
  })

  req.on('end', async () => {
    finished = true

    console.log({ finished, numProcessed, totalNum })

    if (numProcessed === totalNum) {
      res.status(200).send({
        ...process.memoryUsage(),
        endTime: Date.now(),
        startTime,
        data,
        numProcessed
      })
    }
  })
})

app.use('/data-processor-threads', bodyParser.json({ limit: '500mb' }))
app.post('/data-processor-threads', async (req, res) => {
  const startTime = Date.now()
  const numberOfWorkers = req.body.numThreads
  const numberRecordsPerWorker = req.body.data.length / numberOfWorkers
  let workersFinished = 0
  const data = []
  let numProcessed = 0

  for (let i = 0; i < numberOfWorkers; i++) {
    const start = numberRecordsPerWorker * i
    const end = start + numberRecordsPerWorker + 1

    const w = new Worker(`${__dirname}/worker.js`, {
      workerData: {
        data: req.body.data.slice(start, end)
      }
    })

    w.on('message', message => {
      if (message.done) {
        workersFinished++
      }

      numProcessed += message.numProcessed

      data.push(message.data)

      console.log({ done: message.done, numProcessed: message.numProcessed })

      if (workersFinished === numberOfWorkers) {
        res.status(200).send({
          ...process.memoryUsage(),
          endTime: Date.now(),
          startTime,
          data,
          numProcessed
        })
      }
    })
  }
})
