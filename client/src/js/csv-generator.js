import uuidv1 from 'uuid/v1'
import words from 'random-words'

export default ({
  columnDelimiter = ',',
  lineDelimiter = '\n',
  numRecords = 2000
} = {}) => {
  let result = 'id,sentence'

  for (let i = 0; i < numRecords; i++) {
    result += uuidv1()
    result += columnDelimiter
    result += words({ min: 8, max: 20 }).join(' ')

    result += lineDelimiter
  }

  return result
}
