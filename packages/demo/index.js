const createServer = require('../shared/server/createServer')
let requestHandler = require('./server')

const port = 3000
const server = createServer(port, requestHandler)

if (module.hot) {
  module.hot.accept('./server', function() {
    server.removeListener('request', requestHandler)
    requestHandler = require('./server')
    server.on('request', requestHandler)
  })
}
