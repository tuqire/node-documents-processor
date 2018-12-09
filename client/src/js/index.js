import axios from 'axios'
import dataGenerator from './data-generator'
import responseProcessor from './response-processor'
import { addLoader, removeLoader } from './loader'

const getNumRecords = () => {
  const numRecordsVal = document.querySelector('#number-records').value
  return !isNaN(numRecordsVal) ? parseInt(numRecordsVal) : 2000
}

const processData = async (elId, data, type) => {
  const SERVER_URL = 'http://localhost:8094'

  addLoader(elId)

  const { data: responseData } = await axios({
    method: 'post',
    url: `${SERVER_URL}/data-processor-${type}`,
    data
  })

  removeLoader(elId)

  return responseData
}

window.addEventListener('load', () => {
  document.querySelector('#basic-processor-button')
    .addEventListener('click', async () => {
      const elId = 'basic-container'
      const data = dataGenerator(getNumRecords())

      const responseData = await processData(elId, { data }, 'basic')

      responseProcessor(elId, responseData)
    })

  document.querySelector('#threads-processor-button')
    .addEventListener('click', async () => {
      const elId = 'threads-container'
      const data = dataGenerator(getNumRecords())

      const numThreadsVal = document.querySelector('#number-threads').value
      const numThreads = !isNaN(numThreadsVal) ? parseInt(numThreadsVal) : 4

      const responseData = await processData(elId, { data, numThreads }, 'threads')

      responseProcessor(elId, responseData)
    })
})
