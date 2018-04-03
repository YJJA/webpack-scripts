import Koa from 'koa'
import path from 'path'
import http from 'http'
import bodyParser from 'koa-bodyparser'
import helmet from 'koa-helmet'
import morgan from 'koa-morgan'
import proxy from 'koa-proxies'
import session from 'koa-session'
import serve from 'koa-static'
import RedisStore from './RedisStore'

import renderer from './renderer'

const app = new Koa()
const appId = 'demo'

const isDev = process.env.NODE_ENV === 'development'

// helmet
app.use(helmet())

// logger
app.use(morgan(isDev ? 'dev' : 'combined'))

// static
app.use(serve(path.resolve(__dirname, 'public')))
app.use(async (ctx, next) => {
  if (/^\/static\//.test(ctx.path)) {
    await serve(__dirname)(ctx, next)
  } else {
    await next()
  }
})

// session
app.use(session({
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
    ctx.status = err.status || 500
    ctx.body = err
    ctx.app.emit('error', err, ctx)
  }
})

// proxy api
// app.use(proxy('/api', {
//   target: 'http://api.demo.com',
//   changeOrigin: true,
//   logs: isDev
// }))

// body parse
app.use(bodyParser())

// localeData
app.use(async (ctx, next) => {
  const initialState = {
    user: {
      data: ctx.session.user || null
    }
  }

  ctx.localeData = {
    __APPID__: ctx.appId,
    __INITIAL_STATE__: initialState
  }

  await next()
})

// renderer
app.use(renderer)

// NotFound
app.use(async (ctx, next) => {
  ctx.throw(404)
})

// logger error
app.on('error', (err) => {
  console.error(err)
})

export default app.callback()
