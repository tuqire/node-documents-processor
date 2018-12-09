const http = require('http')

const port = 8094

module.exports = app => {
  const server = http.createServer(app)

  server.listen(port, (err) => {
    if (err) {
      return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
  })
}
