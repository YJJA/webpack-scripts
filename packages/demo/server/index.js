const Koa = require('koa')
const koaConfigure = require('../../shared/server/koa-configure')
const renderer = require('../../shared/server/renderer')
const locale = require('../../shared/server/locale')
const routes = require('../../shared/server/routes')
const config = require('../../shared/server/config')

const app = new Koa()
app.context.appId = 'demo'

koaConfigure(app, {
  middlewares: [
    routes,
    locale,
    renderer
  ]
})

module.exports = app.callback()
