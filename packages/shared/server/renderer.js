const fse = require('fs-extra')
const path = require('path')

module.exports = async (ctx, next) => {
  if (ctx.request.header['content-type'] === 'application/json') {
    await next()
    return
  }

  if (!ctx.session.token) {
    ctx.session.view = 1
  }

  const indexPath = path.resolve(__dirname, `../../${ctx.appId}/index.html`)
  let content = await fse.readFile(indexPath, 'utf8')

  if (typeof ctx.localeData === 'object') {
    const localeScripts = Object.keys(ctx.localeData).map(key => {
      return `window.${key}=${JSON.stringify(ctx.localeData[key])}`
    })
    content = content.replace(/(<!--state-->)/, `<script>${localeScripts.join(';')}</script>$1`)
  }

  ctx.body = content
}
