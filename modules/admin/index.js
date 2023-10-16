const { browse, validate, edit, remove } = require('./operation')
const path = require('node:path')

module.exports = app => {
  const { api } = app

  api.on('admin:cats:browse', async (req, res) => {
    res.send(await browse(req.query))
  })

  api.on('admin:cats:validate', async (req, res) => {
    try {
      res.send(await validate(req.params))
    } catch ({ message, code }) {
      res.send({ code, message }, code)
    }
  })

  api.on('admin:cats:edit', async (req, res) => {
    try {
      res.send(await edit({ ...req.params, ...req.body }))
    } catch ({ message, code }) {
      res.send({ code, message }, code)
    }
  })

  api.on('admin:cats:delete', async (req, res) => {
    try {
      res.send(await remove(req.params))
    } catch ({ message, code }) {
      res.send({ code, message }, code)
    }
  })

  app.link('/images', path.resolve(process.cwd(), 'data/images'))

  app.get('/admin', (req, res) => {
    res.render('admin/dashboard')
  }, 'admin')
}
