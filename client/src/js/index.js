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
  document.querySelector('#json-processor-button')
    .addEventListener('click', async () => {
      const elId = 'json-container'

      addLoader(elId, 'Generating data...')

      const data = dataGenerator(getNumRecords())

      removeLoader(elId)

      const responseData = await processData(elId, { data }, 'json')

      responseProcessor(elId, responseData)
    })

  document.querySelector('#buffer-processor-button')
    .addEventListener('click', async () => {
      const elId = 'buffer-container'

      addLoader(elId, 'Generating data...')

      const data = dataGenerator(getNumRecords())

      removeLoader(elId)

      let stringifiedData = '[\n'

      for (let i = 0; i < data.length; i++) {
        stringifiedData += `${JSON.stringify(data[i])}\n`
      }

      stringifiedData += ']'

      const responseData = await processData(elId, stringifiedData, 'buffer')

      responseProcessor(elId, responseData)
    })

  document.querySelector('#threads-processor-button')
    .addEventListener('click', async () => {
      const elId = 'threads-container'

      addLoader(elId, 'Generating data...')

      const data = dataGenerator(getNumRecords())

      removeLoader(elId)

      const numThreadsVal = document.querySelector('#number-threads').value
      const numThreads = !isNaN(numThreadsVal) ? parseInt(numThreadsVal) : 4

      const responseData = await processData(elId, { data, numThreads }, 'threads')

      responseProcessor(elId, responseData)
    })
})
