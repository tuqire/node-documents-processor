const { parentPort, workerData } = require('worker_threads')
const dataProcessor = require('./data-processor')

module.exports = (async () => {
  const numProcessed = await dataProcessor(workerData.data)

  parentPort.postMessage({ done: true, numProcessed })
})()
