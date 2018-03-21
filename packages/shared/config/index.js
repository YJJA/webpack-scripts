const configName = process.env.NODE_ENV || 'development'

module.exports = require(`./${configName}.json`)
