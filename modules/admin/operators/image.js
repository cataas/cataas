import fs from 'node:fs'
import path from 'node:path'
import * as Sentry from '@sentry/node'

import { guard, getCat } from '../service/admin.js'

export const context = 'app'

export const route = {
  method: 'get',
  pattern: '/admin/images/:id'
}

// Les images non validées ne sont pas servies par l'API publique
export const handler = async ({ req, res, store }) => {
  if (!guard({ req, res })) return

  let cat
  try {
    cat = await getCat(store)(req.params.id)
  } catch (e) {
    Sentry.captureException(e)
    console.error(e)

    return res.status(500).send('Error')
  }

  const file = cat && path.resolve(process.cwd(), 'data', 'images', path.basename(cat.file))

  if (!file || !fs.existsSync(file)) {
    return res.status(404).send('Cat not found')
  }

  const buffer = fs.readFileSync(file)

  res.set('Content-Type', cat.mimetype)
  res.set('Content-Length', buffer.length)
  res.set('Cache-Control', 'private, no-store')
  res.send(buffer)
}
