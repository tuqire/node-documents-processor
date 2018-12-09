import uuidv1 from 'uuid/v1'
import words from 'random-words'

export default ({
  numRecords = 20000
} = {}) => {
  let result = []

  for (let i = 0; i < numRecords; i++) {
    result.push({
      id: uuidv1(),
      sentence: words({ min: 8, max: 20 }).join(' ')
    })
  }

  return result
}
