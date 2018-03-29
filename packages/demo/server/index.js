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
import {ServerStyleSheet, StyleSheetManager} from 'styled-components'
import configureStore from '../redux/store'
import App from '../containers/App'

const app = new Koa()

app.use(async (ctx, next) => {
  const history = createHistory({
    initialEntries: [ctx.request.url]
  })
  const store = configureStore(history)

  const indexPath = path.resolve(__dirname, `./index.html`)
  let content = await fse.readFile(indexPath, 'utf8')

  const statsPath = path.resolve(__dirname, './react-loadable.json')
  const stats = await fse.readJSON(statsPath)

  const modules = []
  const sheet = new ServerStyleSheet()
  const html = ReactDOMServer.renderToString(
    <StyleSheetManager sheet={sheet.instance}>
      <Loadable.Capture report={moduleName => modules.push(moduleName)}>
        <Provider store={store}>
          <Router history={history}>
            <App/>
          </Router>
        </Provider>
      </Loadable.Capture>
    </StyleSheetManager>
  )

  const styleTags = sheet.getStyleTags()
  const bundles = getBundles(stats, modules)
  const styles = bundles.filter(bundle => bundle.file.endsWith('.css'))
  const scripts = bundles.filter(bundle => bundle.file.endsWith('.js'))

  content = content.replace('<!--html-->', html)

  content = content.replace(/(<\/head>)/, `${styles.map(bundle => {
    return `<link href="/${bundle.file}" rel="stylesheet"/>`
  }).join('\n')}$1`)
  content = content.replace(/(<\/head>)/, `${styleTags}$1`)

  content = content.replace(/(<\/body>)/, `${scripts.map(bundle => {
    return `<script src="/${bundle.file}"></script>`
  }).join('\n')}<script>window.main()</script>$1`)

  ctx.body = content
})

export default app.callback()
