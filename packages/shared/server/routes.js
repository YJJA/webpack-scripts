const router = require('koa-router')()
const superagent = require('superagent')
const {PassThrough} = require('stream')
const {URL} = require('url')
const httpError = require('http-errors')
const path = require('path')

router.get('/download', async (ctx, next) => {
  const {url} = ctx.query

  let downloadUrl = null
  try {
    downloadUrl = new URL(url)
  } catch (e) {}

  if (!downloadUrl) {
    ctx.throw(httpError(400, '要下载的文件URL不合法'))
    return
  }

  ctx.set({
    'Content-Disposition': `attachment; filename=${path.basename(downloadUrl.pathname)}`
  })

  ctx.body = superagent.get(url)
})

module.exports = router.routes()
