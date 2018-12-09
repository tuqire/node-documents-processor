const http = require('http')

const port = 8095

module.exports = app => {
  const server = http.createServer(app)

  server.listen(port, (err) => {
    if (err) {
      return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
  })

  server.on('error', error => {
    if (error.syscall !== 'listen') {
      throw error
    }

    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges')
        process.exit(1)

      case 'EADDRINUSE':
        console.error(bind + ' is already in use')
        process.exit(1)

      case 'ECONNRESET':
        console.error({ error })
        process.exit(1)

      default:
        throw error
    }
  })
}
