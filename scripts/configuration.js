
const yargs = require('yargs')
const buildEcosystemFile = require('./utils/buildEcosystemFile')
const buildPackageFile = require('./utils/buildPackageFile')

const configuration = (name, argv) => {
  return Promise.all([
    buildEcosystemFile(name, argv),
    buildPackageFile(name, argv)
  ])
}

configuration(yargs.argv._, yargs.argv)
  .catch(err => console.log(err))
