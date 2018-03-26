const koaConfigure = require('../../shared/server/koaConfigure')
const renderer = require('../../shared/server/renderer')
const locale = require('../../shared/server/locale')

const app = koaConfigure({
  appId: 'demo',
  middlewares: [
    locale,
    renderer
  ]
})

module.exports = app.callback()
