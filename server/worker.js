const { parentPort, workerData } = require('worker_threads')
const axios = require('axios')

const EXTERNAL_SERVER_URL = 'http://localhost:8095'

module.exports = (async () => {
  let numProcessed = 0

  for (let i = workerData.start; i < workerData.end; i++) {
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

  parentPort.postMessage({ done: true, numProcessed })
})()
