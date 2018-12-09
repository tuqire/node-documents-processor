import axios from 'axios'
import dataGenerator from './data-generator'
import responseProcessor from './response-processor'
import { addLoader, removeLoader } from './loader'

const SERVER_URL = 'http://localhost:8094'

window.addEventListener('load', () => {
  console.log('page ready')

  document.querySelector('#post-data-basic-button')
    .addEventListener('click', async () => {
      console.log('#post-data-button pressed')
      const data = dataGenerator()

      addLoader()

      const { data: responseData } = await axios({
        method: 'post',
        url: `${SERVER_URL}/data-processor-basic`,
        data: {
          data
        }
      })

      removeLoader()
      responseProcessor(responseData)
    })
})
