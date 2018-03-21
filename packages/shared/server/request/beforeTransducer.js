module.exports = function(before) {
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
