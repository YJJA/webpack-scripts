
'use strict'

/*
  run server
 */
const path = require('path')
const spawn = require('cross-spawn')

let server

// run server
module.exports = function runServer(serverPath) {
  return new Promise((resolve, reject) => {
    if (server) {
      server.kill('SIGTERM')
    }

    server = spawn('node', [serverPath], {
      env: process.env,
      silent: false
    })

    let isResolve = false
    let timeId = null
    let serverStdoutHandle = data => {
      timeId && clearTimeout(timeId)
      if (!isResolve) {
        console.log('server is running...')
        const str = data.toString('utf8')
        const result = str.match(/Listening on port (\d{4})/)
        if (result) {
          isResolve = true
          return resolve(result[1])
        }
      }
      process.stdout.write(data)
    }

    server.stdout.on('data', data => serverStdoutHandle(data))
    server.stderr.on('data', err => process.stderr.write(err))
  })
}

process.on('exit', () => {
  if (server) {
    server.kill('SIGTERM')
  }
})
