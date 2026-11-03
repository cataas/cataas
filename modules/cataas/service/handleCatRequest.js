import fsp from 'node:fs/promises'
import path from 'node:path'
import * as Sentry from '@sentry/node'

import { findCat, editImage, getUrl, getCacheKey, cacheRoot } from './operations.js'

export default async ({ req, res, store }) => {
  const { html, json } = req.query
  const cat = await findCat(store)(req.params)

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
    const dir = path.join(cacheRoot, cat.id)
    const cachedImagePath = path.join(dir, getCacheKey(req.params.text, req.query))

    try {
      const file = await fsp.readFile(cachedImagePath)

      // Rafraîchit l'âge (au plus une fois par jour) : le TTL vaut « dernier usage »
      fsp.stat(cachedImagePath)
        .then(({ mtimeMs }) => Date.now() - mtimeMs > 86400 * 1000 && fsp.utimes(cachedImagePath, new Date(), new Date()))
        .catch(() => {})

      res.setHeader('Content-Type', cat.mimetype)
      res.setHeader('Content-Length', file.length)

      res.write(file)
      res.end()

      return
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }

    const imagePath = path.resolve(process.cwd(), 'data', 'images', cat.file)
    const file = await fsp.readFile(imagePath)
    const buffer = await editImage(req, file, cat.mimetype)

    res.setHeader('Content-Type', cat.mimetype)
    res.setHeader('Content-Length', buffer.length)

    try {
      // Écriture atomique : jamais de rendu partiel servi à une requête concurrente
      const tmp = `${cachedImagePath}.${process.pid}.${Date.now()}.tmp`
      await fsp.mkdir(dir, { recursive: true })
      await fsp.writeFile(tmp, buffer)
      await fsp.rename(tmp, cachedImagePath)
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
