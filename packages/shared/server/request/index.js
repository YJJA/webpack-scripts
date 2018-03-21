const superagent = require('superagent')
const afterTransducer = require('./afterTransducer')
const beforeTransducer = require('./beforeTransducer')
const afterCallback = require('./afterCallback')

const beforeCallback = require('./beforeCallback')({})

let request = beforeTransducer(beforeCallback)(superagent)
request = afterTransducer(afterCallback)(request)

module.exports = request
