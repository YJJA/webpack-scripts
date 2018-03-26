
const yargs = require('yargs')
const buildEcosystemFile = require('./utils/buildEcosystemFile')
const buildPackageFile = require('./utils/buildPackageFile')

const configuration = async (names, argv) => {
  return Promise.all([
    buildEcosystemFile(names, argv),
    buildPackageFile(names, argv)
  ])
}

configuration(yargs.argv._, yargs.argv)
  .catch(err => console.log(err))
