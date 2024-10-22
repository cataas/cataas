const { findCat, cats, tags, count, getUrl, editImage, createCat } = require('./operations')
//const { sendAnalytic } = require('./analytics')
const fs = require('fs')

module.exports = app => {
  const { api } = app

  const handleCatRequest = async (req, res) => {
    const { html, json } = req.query
    const cat = await findCat({ ...req.params, ...req.query })

    //sendAnalytic(req)

    if (!cat) {
      return res.send('Cat not found', 404)
    }

    if (json || (req.headers.accept && req.headers.accept.match(/application\/json/))) {
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
                <title>Cat as a service (CATAAS)</title>
                <meta charset="utf-8">
                <meta name="description" content="Cat as a service (CATAAS) is a REST API to spread peace and love (or not) thanks to cats.">
                <meta name="author" content="Kevin Balicot">

                <meta property="og:title" content="Cat as a service (CATAAS)">
                <meta property="og:description" content="Cat as a service (CATAAS) is a REST API to spread peace and love (or not) thanks to cats.">
                <meta property="og:url" content="https://cataas.com">
                <meta property="og:image" content="${getUrl(req.params.tag, req.params.text, req.query, cat._id)}">
                <meta property="og:type" content="website">
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
    } catch (error) {
      const { message, code } = error

      console.error(error)
      res.send({ code, message }, 500)
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
    if (!req.body.file.mimeType.match(/image\/*/)) {
      return res.render('upload', { error: 'Only images are allowed' })
    }

    try {
      await createCat(req.body)
    } catch (e) {
      console.error(e)

      return res.render('upload', { error: e.message })
    }

    res.render('upload', { ok: true })
  })
}
