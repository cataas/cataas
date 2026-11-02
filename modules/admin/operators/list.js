import * as Sentry from '@sentry/node'

import { guard, listCats } from '../service/admin.js'

export const context = 'app'

export const route = {
  method: 'get',
  pattern: '/admin'
}

export const handler = async ({ req, res, store, view }) => {
  if (!guard({ req, res })) return

  const status = ['pending', 'validated', 'all'].includes(req.query.status) ? req.query.status : 'pending'

  try {
    view.render('admin/cats', {
      status,
      ...await listCats(store)({ status, page: req.query.page })
    })
  } catch (e) {
    Sentry.captureException(e)
    console.error(e)

    res.status(500).send('Error')
  }
}
