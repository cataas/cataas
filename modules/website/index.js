const path = require('node:path')
const config = require('../../src/shared/configuration/configurator')

module.exports = app => {
  const cache = config.get('cache', {})
  app.use((req, res, next) => {
    if (req.headers['if-none-match'] && req.headers['if-none-match'] === String(cache.ETag)) {
      return res.status(304).send()
    }

    next()
  })

  app.link('/modules', path.resolve(process.cwd(), 'node_modules'), cache)
  app.link('/assets', path.resolve(process.cwd(), 'public'), cache)
  app.link('/build', path.resolve(process.cwd(), 'public/build'), cache)

  app.get('/', (req, res) => {
    res.render('homepage')
  }, 'homepage')

  app.get('/upload', (req, res) => {
    res.render('upload')
  }, 'upload')

  app.get('/404', (req, res) => {
    res.render('error/404')
  }, 'error:not_found')
}
