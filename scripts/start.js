
'use strict'

process.env.NODE_ENV = 'development'
/*
  start script
  */
const path = require('path')
const webpack = require('webpack')
const fse = require('fs-extra')
const browserSync = require('browser-sync')
const yargs = require('yargs')

const config = require('./config')
const watchClient = require('./utils/watchClient')
const watchServer = require('./utils/watchServer')
const copyServer = require('./utils/copyServer')
const runServer = require('./utils/runServer')

// start
const start = async (name, argv) => {
  // 删除临时文件
  await fse.remove(path.resolve(config.temp, name))
  // 启动客户端编译服务
  const clientPromise = watchClient(name, argv)
  // 启动服务端编译服务
  let serverpath = await watchServer(name, argv)
  // if (argv.server) {
  //   console.log('watchServer')
  //   serverpath = await watchServer(name, argv)
  // } else {
  //   serverpath = await copyServer(name, argv)
  // }
  const serverPromise = runServer(serverpath)
  const [middleware, port] = await Promise.all([clientPromise, serverPromise])

  // 启动代理服务
  const bs = browserSync.create()
  bs.init({
    port: Number(port) + 1,
    notify: false,
    proxy: {
      target: `http://localhost:${port}`,
      middleware: middleware,
      proxyOptions: {
        xfwd: true
      }
    }
  })
}

const [name] = yargs.argv._

start(name, yargs.argv)
  .catch(err => console.log(err))
