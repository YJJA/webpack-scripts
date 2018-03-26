const http = require('http')

// createHttp
module.exports = function createServer(port, requestHandler) {
  let server = http.createServer()
  server.on('request', requestHandler)
  server.on('error', onError)
  server.on('listening', onListening)
  server.listen(process.env.PORT || port)

  // onError
  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error
    }

    let bind = typeof port === 'string'
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
      default:
        throw error
    }
  }

  // onListening
  function onListening() {
    let addr = server.address()
    let bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port
    console.log('Listening on ' + bind)
  }

  return server
}
