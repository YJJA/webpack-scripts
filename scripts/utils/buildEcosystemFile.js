const fse = require('fs-extra')
const path = require('path')
const config = require('../config')
const packageJSON = require(path.resolve('./package.json'))

module.exports = function(names, argv) {
  names = Array.isArray(names) ? names : [names]
  const apps = names.map(name => {
    return {
      name: `${packageJSON.name}-${name}`,
      script: `./${name}/index.js`,
      watch: false,
      instances: 1,
      node_args: '--harmony',
      exec_interpreter : 'node',
      log_date_format  : 'YYYY-MM-DD HH:mm Z',
      merge_logs: false,
      env: {
        NODE_ENV: argv.env
      },
      error_file: `./${name}/logs/error/error.log`,
      out_file: `./${name}/logs/out/out.log`
    }
  })

  const dist = path.resolve(`${config.dist}/ecosystem.json`)
  return fse.outputJson(dist, {apps}, {spaces: 2})
}
