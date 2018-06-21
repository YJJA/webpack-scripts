
import fse from 'fs-extra'
import path from 'path'
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

export default async function renderer(ctx, next) {
  await Loadable.preloadAll()

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

  // 填充页面
  content = content.replace('<!--html-->', html)

  // 填充数据
  if (typeof ctx.localeData === 'object') {
    const localeScripts = Object.keys(ctx.localeData).map(key => {
      return `window.${key}=${JSON.stringify(ctx.localeData[key])}`
    }).join(';')
    content = content.replace(/(<\/head>)/, `<script>${localeScripts}</script>$1`)
  }

  // 样式引用
  content = content.replace(/(<\/head>)/, `${styles.map(bundle => {
    return `<link href="/${bundle.file}" rel="stylesheet"/>`
  }).join('\n')}$1`)

  // styled 样式
  content = content.replace(/(<\/head>)/, `${styleTags}$1`)

  // 脚本引用
  const scriptsarr = scripts.map(bundle => {
    return `<script src="/${bundle.file}"></script>`
  })
  content = content.replace(/(<\/body>)/, `${scriptsarr.join('\n')}<script>window.main()</script>$1`)

  ctx.body = content
}
