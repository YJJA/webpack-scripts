const _isEmpty = require('lodash/isEmpty')

module.exports = function (err, res, callback) {
  if (err) {
    let error = {message: err.message}
    if (err.response && err.response.body) {
      error = err.response.body
    }

    return callback(error, null)
  }

  let body = res.body
  if (_isEmpty(body)) {
    try {
      body = JSON.stringify(res.text)
    } catch (e) {}
  }

  if (_isEmpty(body) || (body.status >= 2000 && body.status < 3000)) {
    return callback(null, body)
  }

  callback(body, null)
}
