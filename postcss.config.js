module.exports = {
  plugins: [
    require('postcss-import')(),
    // require('stylelint')(stylelintConfig),
    require('postcss-cssnext')({
      browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9']
    })
  ]
}
