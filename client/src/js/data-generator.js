import uuidv1 from 'uuid/v1'
import words from 'random-words'

export default (numRecords = 2000) => {
  let result = []

  for (let i = 0; i < numRecords; i++) {
    result.push({
      id: uuidv1(),
      sentence: words({ min: 25, max: 50 }).join(' ')
    })
  }

  return result
}
