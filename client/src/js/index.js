import axios from 'axios'
import dataGenerator from './data-generator'
import responseProcessor from './response-processor'
import { addLoader, removeLoader } from './loader'

const SERVER_URL = 'http://localhost:8094'

const getNumRecords = () => {
  const numRecordsVal = document.querySelector('#number-records').value
  return !isNaN(numRecordsVal) ? parseInt(numRecordsVal) : 2000
}

const processData = async (
  elId,
  type,
  dataCallback = d => ({ data: d })
) => {
  addLoader(elId, 'Generating data...')

  setTimeout(async () => {
    const _data = dataGenerator(getNumRecords())

    removeLoader(elId)

    addLoader(elId)

    const data = dataCallback(_data)

    const { data: responseData } = await axios({
      method: 'post',
      url: `${SERVER_URL}/data-processor-${type}`,
      data
    })

    removeLoader(elId)

    responseProcessor(elId, responseData)
  }, 0)
}

window.addEventListener('load', () => {
  document.querySelector('#json-processor-button')
    .addEventListener('click', () => {
      const elId = 'json-container'

      processData(elId, 'json')
    })

  document.querySelector('#buffer-processor-button')
    .addEventListener('click', () => {
      const elId = 'buffer-container'

      processData(elId, 'buffer', data => {
        let stringifiedData = ''

        for (let i = 0; i < data.length; i++) {
          stringifiedData += `\n${JSON.stringify(data[i])}`
        }

        return stringifiedData
      })
    })

  document.querySelector('#threads-processor-button')
    .addEventListener('click', () => {
      const elId = 'threads-container'
      const numThreadsVal = document.querySelector('#number-threads').value
      const numThreads = !isNaN(numThreadsVal) ? parseInt(numThreadsVal) : 4

      processData(elId, 'threads', data => ({ data, numThreads }))
    })
})
