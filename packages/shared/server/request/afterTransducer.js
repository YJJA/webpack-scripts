const _noop = require('lodash/noop')

module.exports = function (transform) {
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
