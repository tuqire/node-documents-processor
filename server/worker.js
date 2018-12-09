const { parentPort, workerData } = require('worker_threads')
const axios = require('axios')

const EXTERNAL_SERVER_URL = 'http://localhost:8095'

module.exports = (async app => {
  for (let i = workerData.start; i < workerData.numToProcess; i++) {
    try {
      await axios({
        method: 'post',
        url: `${EXTERNAL_SERVER_URL}/mock-parser`
      })
    } catch (err) {
      console.log({ err })
    }
  }

  parentPort.postMessage({ done: 'done' })
})()
