const createServer = require('../shard/server/createServer')
let requestHandler = require('./server')

const port = 4804
const server = createServer(port, requestHandler)

if (module.hot) {
  module.hot.accept('./server', function() {
    server.removeListener('request', requestHandler)
    requestHandler = require('./server')
    server.on('request', requestHandler)
  })
}
