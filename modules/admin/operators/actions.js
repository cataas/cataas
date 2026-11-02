import * as Sentry from '@sentry/node'

import { guard, validateCat, updateTags, deleteCat } from '../service/admin.js'

export const context = 'app'

export const route = {
  method: 'post',
  pattern: '/admin/cats/:id/:action'
}

const actions = {
  validate: (store, id) => validateCat(store)(id),
  tags: (store, id, body) => updateTags(store)(id, body.tags),
  delete: (store, id) => deleteCat(store)(id)
}

export const handler = async ({ req, res, store }) => {
  if (!guard({ req, res })) return

  const { id, action } = req.params
  const body = typeof req.body === 'object' ? req.body : {}

  if (!actions[action]) {
    return res.status(404).send('Not found')
  }

  try {
    await actions[action](store, id, body)
  } catch (e) {
    // P2025 : l'image n'existe (plus) en base
    if (e.code !== 'P2025') {
      Sentry.captureException(e)
      console.error(e)

      return res.status(500).send('Error')
    }
  }

  // `return` limité aux chemins internes pour éviter une redirection ouverte
  const back = typeof body.return === 'string' && /^\/admin(\?[\w=&]*)?$/.test(body.return)
    ? body.return
    : '/admin'

  res.redirect(back, 303)
}
