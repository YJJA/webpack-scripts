const Koa = require('koa')
const path = require('path')
const http = require('http')
const bodyParser = require('koa-bodyparser')
const helmet = require('koa-helmet')
const morgan = require('koa-morgan')
const proxy = require('koa-proxies')
const session = require('koa-session')
const serve = require('koa-static')
const mount = require('koa-mount')
const config = require('./config')
const RedisStore = require('./RedisStore')

const isDev = process.env.NODE_ENV === 'development'

// koa-configure
module.exports = function koaConfigure({
  appId,
  middlewares
}) {
  const app = new Koa()
  app.context.appId = appId

  app.keys = [`${appId} GfQHM5H9daCX`, `${appId} 8ydDke7KP5nW`]
  // helmet
  app.use(helmet())
  // logger
  app.use(morgan(isDev ? 'dev' : 'combined'))

  // static
  app.use(serve(path.resolve(__dirname, `../../${appId}/public`), {
    maxage: isDev ? 3600 * 1000 : 0
  }))

  // session
  const store = new RedisStore(config.redis)
  app.use(session({
    store,
    prefix: `${appId}:`,
    key: `${appId}`,
    maxAge: 3 * 60 * 60 * 1000,
    rolling: true,
    renew: true
  }, app))

  // error
  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      ctx.status = 400
      ctx.body = err
      ctx.app.emit('error', err, ctx)
    }
  })

  // token
  app.use(async (ctx, next) => {
    if (ctx.session && ctx.session.token) {
      ctx.request.header['tokenId'] = ctx.session.token
    }
    ctx.request.header['platform'] = 'PC'
    await next()
  })

  // proxy api
  Object.keys(config.api).forEach(key => {
    app.use(proxy(key, {
      target: config.api[key],
      changeOrigin: true,
      rewrite: path => path.replace(new RegExp(`^(${key})`), `${config.version}$1`),
      logs: isDev
    }))
  })

  // body parse
  app.use(bodyParser())

  // middleware
  if (Array.isArray(middlewares)) {
    middlewares.forEach(middleware => {
      app.use(middleware)
    })
  }

  // NotFound
  app.use(async (ctx, next) => {
    ctx.throw(404)
  })

  // logger error
  app.on('error', (err) => {
    console.error(err)
  })

  return app
}