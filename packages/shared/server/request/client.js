import superagent from 'superagent'
import _isEmpty from 'lodash/isEmpty'
import _noop from 'lodash/noop'

function afterTransducer(transform) {
  return function(request) {
    request.Request.prototype.superCallback = request.Request.prototype.callback
    request.Request.prototype.callback = function(err, res) {
      const fn = this._callback || _noop
      this._callback = function(err, res) {
        transform(err, res, fn)
      }
      this.superCallback(err, res)
    }
    return request
  }
}

function beforeTransducer(before) {
  return function(request) {
    const superEnd = request.Request.prototype.end
    request.Request.prototype.superEnd = superEnd
    request.Request.prototype.end = function(fn) {
      before(this)
      this.superEnd(fn)
    }
    return request
  }
}

function afterCallback(err, res, callback) {
  if (err) {
    let error = {message: err.crossDomain ? '网络中断，请检查网络或稍后再操作。' : err.message}
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

function beforeCallback (request) {
  if (request.method === 'GET') {
    request.set('Accept', 'application/json')
  }
}

let request = beforeTransducer(beforeCallback)(superagent)
request = afterTransducer(afterCallback)(request)

export default request
