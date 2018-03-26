const acceptLanguage = require('accept-language')

module.exports = (props) => {
  acceptLanguage.languages(props.languages)

  return async(ctx, next) => {
    if (ctx.request.header['content-type'] === 'application/json') {
      await next()
      return
    }
    let lang = acceptLanguage.get(ctx.request.header['accept-language'])

    if (ctx.request.url === '/') {
      return ctx.redirect(`/${lang}/`)
    }

    const result = ctx.request.url.match(/^\/([a-zA-Z\-_]*)/)
    if (result && props.languages.includes(result[1])) {
      lang = result[1]
    } else {
      const url = ctx.request.url.replace(/^/, `/${lang}`)
      return ctx.redirect(url)
    }

    ctx.state.lang = lang
    ctx.state.locales = props.locales[lang] || {}
    await next()
  }
}
