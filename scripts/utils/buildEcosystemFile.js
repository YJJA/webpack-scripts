const fse = require('fs-extra')
const path = require('path')
const config = require('../config')

/* eslint key-spacing: "off" */
module.exports = function(names, argv) {
  names = Array.isArray(names) ? names : [names]
  const apps = names.map(name => {
    return {
      name,
      script: `./packages/${name}/index.js`,
      watch: false,
      instances: 1,
      node_args: '--harmony',
      exec_interpreter : 'node',
      log_date_format  : 'YYYY-MM-DD HH:mm Z',
      merge_logs: false,
      env: {
        NODE_ENV: argv.env
      },
      error_file: `./packages/${name}/logs/error/error.log`,
      out_file: `./packages/${name}/logs/out/out.log`
    }
  })

  const dist = path.resolve(`${config.distRoot}/ecosystem.json`)
  return fse.outputJson(dist, {apps}, {spaces: 2})
}
