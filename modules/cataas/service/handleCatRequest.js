import { createReadStream } from 'node:fs'
import fsp from 'node:fs/promises'
import { pipeline } from 'node:stream/promises'
import path from 'node:path'
import * as Sentry from '@sentry/node'

import { mimeByFormat } from './placeholder.js'
import renderQueue, { QueueFullError } from './renderQueue.js'
import { findCat, editImage, getUrl, getCacheKey, cacheRoot } from './operations.js'

export default async ({ req, res, store, rand }) => {
  const { html, json } = req.query
  const cat = await findCat(store)(req.params, { rand })

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

  const contentType = mimeByFormat[req.query.format] || cat.mimetype
  // Même URL => même image : /cat/{id}… ou tirage seedé (avatar). Sinon le chat change à chaque appel.
  const deterministic = Boolean(req.params.id || rand)

  try {
    const cacheKey = getCacheKey(req.params.text, req.query)
    const dir = path.join(cacheRoot, cat.id)
    const cachedImagePath = path.join(dir, cacheKey)
    const etag = `"${cat.id}-${cacheKey}"`

    const setHeaders = (length) => {
      res.setHeader('Content-Type', contentType)
      res.setHeader('Content-Length', length)

      if (deterministic) {
        res.setHeader('Cache-Control', 'public, max-age=86400')
        res.setHeader('ETag', etag)
      } else {
        res.setHeader('Cache-Control', 'no-store')
      }
    }

    if (deterministic && req.headers['if-none-match'] === etag) {
      res.statusCode = 304
      return res.end()
    }

    // Envoi en flux : pas de Buffer complet en mémoire, et le client lent applique la backpressure
    const stream = (filePath, length) => {
      setHeaders(length)
      return pipeline(createReadStream(filePath), res).catch(() => {})
    }

    try {
      const { size, mtimeMs } = await fsp.stat(cachedImagePath)

      // Rafraîchit l'âge (au plus une fois par jour) : le TTL vaut « dernier usage »
      if (Date.now() - mtimeMs > 86400 * 1000) {
        fsp.utimes(cachedImagePath, new Date(), new Date()).catch(() => {})
      }

      return await stream(cachedImagePath, size)
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }

    const imagePath = path.resolve(process.cwd(), 'data', 'images', cat.file)

    // Aucune transformation demandée : l'original est servi tel quel (pas de décodage, notamment des GIF animés)
    if (cacheKey === 'original') {
      const { size } = await fsp.stat(imagePath)

      return await stream(imagePath, size)
    }

    const buffer = await renderQueue.run(cachedImagePath, async () => {
      const rendered = await editImage(req, imagePath, cat.mimetype)

      try {
        // Écriture atomique : jamais de rendu partiel servi à une requête concurrente
        const tmp = `${cachedImagePath}.${process.pid}.${Date.now()}.tmp`
        await fsp.mkdir(dir, { recursive: true })
        await fsp.writeFile(tmp, rendered)
        await fsp.rename(tmp, cachedImagePath)
      } catch (error) {
        Sentry.captureException(error)
      }

      return rendered
    })

    setHeaders(buffer.length)
    res.write(buffer)
    res.end()
  } catch (error) {
    if (error instanceof QueueFullError) {
      res.setHeader('Retry-After', '2')
      return res.send('Service busy, retry shortly', 503)
    }

    Sentry.captureException(error)
    const { message, code } = error

    console.error(error)
    res.send({ code, message }, 500)
  }
}
