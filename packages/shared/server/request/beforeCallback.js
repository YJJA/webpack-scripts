module.exports = function (argvs) {
  return function (request) {
    if (request.method === 'POST') {
      request.send(argvs)
    }
    if (request.method === 'GET') {
      request.query(argvs)
        .set('Accept', 'application/json')
    }
  }
}
