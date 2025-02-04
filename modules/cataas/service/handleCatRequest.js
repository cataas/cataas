import fs from 'node:fs'
import path from 'node:path'
import * as Sentry from '@sentry/node'

import { sendAnalytic } from './analytics.js'
import { findCat, editImage, getUrl, getId } from './operations.js'

export default async ({ req, res, store }) => {
  const { html, json } = req.query
  const cat = await findCat(store)(req.params.id)

  sendAnalytic(req)

  if (!cat) {
    return res.send('Cat not found', 404)
  }

  if (json || (req.headers.accept && req.headers.accept.match(/application\/json/))) {
    return res.json({
      id: cat.id,
      tags: cat.tags,
      created_at: cat.createdAt,
      url: getUrl(req.params.tag, req.params.text, req.query, cat.id),
      mimetype: cat.mimetype
    })
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
          <meta property="og:image" content="${getUrl(req.params.tag, req.params.text, req.query, cat.id)}">
          <meta property="og:type" content="website">
        </header>
        <body>
          <img alt="${cat.id}" src="${getUrl(req.params.tag, req.params.text, req.query, cat.id)}">
        </body>
      </html>
      `

    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Content-Length', template.length)
    res.write(template)

    return res.end()
  }

  try {
    const id = getId(cat.id, req.params.text, req.query)
    const cachedImagePath = path.resolve(process.cwd(), 'data', 'cache', 'images', id)
    if (fs.existsSync(cachedImagePath)) {
      const file = fs.readFileSync(cachedImagePath)

      res.setHeader('Content-Type', cat.mimetype)
      res.setHeader('Content-Length', file.length)

      res.write(file)
      res.end()

      return
    }

    const imagePath = path.resolve(process.cwd(), 'data', 'images', cat.file)
    const file = fs.readFileSync(imagePath)
    const buffer = await editImage(req, file, cat.mimetype)

    res.setHeader('Content-Type', cat.mimetype)
    res.setHeader('Content-Length', buffer.length)

    try {
      fs.writeFileSync(cachedImagePath, buffer)
    } catch (error) {
      Sentry.captureException(error)
    }

    res.write(buffer)
    res.end()
  } catch (error) {
    Sentry.captureException(error)
    const { message, code } = error

    console.error(error)
    res.send({ code, message }, 500)
  }
}
