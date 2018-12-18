const axios = require('axios')

const EXTERNAL_SERVER_URL = 'http://localhost:8095'

module.exports = async (data, {
  withRequest = false
} = {}) => {
  let numProcessed = 0
  const newData = []

  for (let i = 0; i < data.length; i++) {
    try {
      if (!data[i] || !data[i].id) {
        numProcessed++
        continue
      }

      newData[i] = {
        id: data[i].id,
        sentence: data[i].sentence
      }

      if (withRequest) {
        await axios({
          method: 'post',
          url: `${EXTERNAL_SERVER_URL}/mock-parser`
        })

        numProcessed++
      } else {
        newData[i].sentence = data[i].sentence.split(' ').reverse().join(' ')
        numProcessed++
      }
    } catch (err) {
      console.error({ err })
    }
  }

  return {
    data: newData,
    numProcessed
  }
}
