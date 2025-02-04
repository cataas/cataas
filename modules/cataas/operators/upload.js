import * as Sentry from '@sentry/node'
import { z } from '@boutdecode/open-api'
import { createCat } from '../service/operations.js'

export const context = 'app'

export const route = {
  method: 'post',
  pattern: '/upload'
}

export const handler = async ({ req, store, view }) => {
  if (!req.body.file.mimeType.match(/image\/*/)) {
    return view.render('upload', { error: 'Only images are allowed' })
  }

  try {
    await createCat(store)(req.body)
  } catch (e) {
    Sentry.captureException(e)
    console.error(e)

    return view.render('upload', { error: e.message })
  }

  view.render('upload', { ok: true })
}
