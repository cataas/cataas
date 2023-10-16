const { findCat, cats, tags, count, getUrl, editImage, createCat } = require('./operations')
const { sendAnalytic } = require('./analytics')
const fs = require('fs')

module.exports = app => {
  const { api } = app

  const handleCatRequest = async (req, res) => {
    const { html, json } = req.query
    const cat = await findCat({ ...req.params, ...req.query })

    sendAnalytic(req)

    if (!cat) {
      return res.send('Cat not found', 404)
    }

    if (json) {
      delete cat.owner
      delete cat.validated
      delete cat.file

      return res.json(cat)
    }

    if (html) {
      const template = `
        <!DOCTYPE html>
        <html lang="en">
            <header>
                <meta charset="utf-8">
            </header>
            <body>
                <img alt="${cat._id}" src="${getUrl(req.params.tag, req.params.text, req.query, cat._id)}">
            </body>
        </html>
      `

      res.setHeader('Content-Type', 'text/html')
      res.setHeader('Content-Length', template.length)
      res.write(template)

      return res.end()
    }

    try {
      const file = fs.readFileSync(`${__dirname}/../../data/images/${cat.file}`)
      const buffer = await editImage(req, file, cat.mimetype)

      res.setHeader('Content-Type', cat.mimetype)
      res.setHeader('Content-Length', buffer.length)

      res.write(buffer)
      res.end()
    } catch ({ message, code }) {
      res.send({ code, message }, code || 500)
    }
  }

  api.on('cat:random', handleCatRequest)
  api.on('cat:random:text', handleCatRequest)
  api.on('cat:random:tag', handleCatRequest)
  api.on('cat:random:tag:text', handleCatRequest)
  api.on('cat:get', handleCatRequest)
  api.on('cat:get:text', handleCatRequest)

  api.on('api:cats', async (req, res) => {
    try {
      res.send(await cats(req.query))
    } catch ({ message, code }) {
      res.send({ code, message }, code)
    }
  })

  api.on('api:tags', async (req, res) => {
    try {
      res.send(await tags())
    } catch ({ message, code }) {
      res.send({ code, message }, code)
    }
  })

  api.on('api:count', async (req, res) => {
    try {
      res.send(await count())
    } catch ({ message, code }) {
      res.send({ code, message }, code)
    }
  })

  app.post('/upload', async (req, res) => {
    try {
      await createCat(req.body)
    } catch ({ message }) {
      return res.render('upload', { error: message })
    }

    res.render('upload', { ok: true })
  })
}
