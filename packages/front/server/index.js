const Koa = require('koa')
const renderer = require('../../shared/server/middlewares/renderer')
const locale = require('../../shared/server/middlewares/locale')
const koaConfigure = require('../../shared/server/koa-configure')
const routes = require('../../shared/server/routes')
const config = require('../../shared/config')

const app = new Koa()
app.context.appId = 'front'

koaConfigure(app, {
  middlewares: [
    routes,
    locale,
    renderer
  ]
})

module.exports = app.callback()
