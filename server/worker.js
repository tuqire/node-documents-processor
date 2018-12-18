const { parentPort, workerData } = require('worker_threads')
const dataProcessor = require('./data-processor')

module.exports = (async () => {
  const { data, numProcessed } = await dataProcessor(workerData.data)

  parentPort.postMessage({ done: true, data, numProcessed })
})()
