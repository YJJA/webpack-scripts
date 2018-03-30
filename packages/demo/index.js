import createServer from './server/createServer'

const port = 3000
let requestHandler = require('./server').default
const server = createServer(port, requestHandler)

if (module.hot) {
  module.hot.accept('./server', function() {
    server.removeListener('request', requestHandler)
    requestHandler = require('./server').default
    server.on('request', requestHandler)
  })
}
