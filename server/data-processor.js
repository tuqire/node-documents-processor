const axios = require('axios')

const EXTERNAL_SERVER_URL = 'http://localhost:8095'

module.exports = async data => {
  let numProcessed = 0

  for (let i = 0; i < data.length; i++) {
    try {
      await axios({
        method: 'post',
        url: `${EXTERNAL_SERVER_URL}/mock-parser`
      })
      numProcessed++
      // console.log({ numProcessed })
    } catch (err) {
      console.error({ err })
    }
  }

  return numProcessed
}
