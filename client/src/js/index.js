import axios from 'axios'
import dataGenerator from './data-generator'
import responseProcessor from './response-processor'
import { addLoader, removeLoader } from './loader'

const getNumRecords = () => {
  const numRecordsVal = document.querySelector('#number-records').value
  return !isNaN(numRecordsVal) ? numRecordsVal : 2000
}

const processData = async (elId, data) => {
  const SERVER_URL = 'http://localhost:8094'

  addLoader(elId)

  const { data: responseData } = await axios({
    method: 'post',
    url: `${SERVER_URL}/data-processor-basic`,
    data: { data }
  })

  removeLoader(elId)

  return responseData
}

window.addEventListener('load', () => {
  document.querySelector('#basic-processor-button')
    .addEventListener('click', async () => {
      const elId = 'basic-container'
      const data = dataGenerator(getNumRecords())

      const responseData = await processData(elId, data)

      responseProcessor(elId, responseData)
    })
})
