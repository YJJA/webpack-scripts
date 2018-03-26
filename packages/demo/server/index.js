import Koa from 'koa'
import path from 'path'
import fse from 'fs-extra'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import {Provider} from 'react-redux'
import {ConnectedRouter as Router} from 'react-router-redux'
import createHistory from 'history/createMemoryHistory'
import Loadable from 'react-loadable'
import {getBundles} from 'react-loadable/webpack'
import configureStore from '../redux/store'
import App from '../containers/App'

const app = new Koa()

app.use(async (ctx, next) => {
  const history = createHistory({
    initialEntries: [ctx.request.url]
  })
  const store = configureStore(history)

  // const indexPath = path.resolve(__dirname, `./index.html`)
  // let content = await fse.readFile(indexPath, 'utf8')

  const statsPath = path.resolve(__dirname, './react-loadable.json')
  const stats = await fse.readJSON(statsPath)

  const modules = []
  const html = ReactDOMServer.renderToString(
    <Loadable.Capture report={moduleName => modules.push(moduleName)}>
      <Provider store={store}>
        <Router history={history}>
          <App/>
        </Router>
      </Provider>
    </Loadable.Capture>
  )

  const bundles = getBundles(stats, modules)
  const styles = bundles.filter(bundle => bundle.file.endsWith('.css'))
  const scripts = bundles.filter(bundle => bundle.file.endsWith('.js'))

  const content = `
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="renderer" content="webkit">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title></title>
  <meta name="keywords" content="" />
  <meta name="description" content="">
  <link rel="dns-prefetch" href="" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
  <meta name="format-detection" content="telephone=no" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-touch-fullscreen" content="yes">
  <meta name="msapplication-tap-highlight" content="no">
  ${styles.map(bundle => `<link href="/${bundle.file}" rel="stylesheet"/>`).join('\n')}
</head>
<body>
  <div id="app" class="app">${html}</div>
  <script src="/static/scripts/manifest.js"></script>
  ${scripts.map(bundle => `<script src="/${bundle.file}"></script>`).join('\n')}
  <script src="/static/scripts/main.js"></script>
</body>
</html>
`

  ctx.body = content
})

module.exports = app.callback()
