import { z } from '@boutdecode/open-api'

import { parameters } from '../../definitions/schemas.js'
import handleCatRequest from '../../service/handleCatRequest.js'
import { seededRandom } from '../../service/operations.js'

export const context = 'api'

export const route = {
  method: 'get',
  pattern: '/avatar/{seed}'
}

export const input = {
  path: z.object({
    seed: z.string().min(1).max(128).openapi({ param: { in: 'path', name: 'seed' } })
  }),
  query: parameters
}

export const openapi = {
  operationId: 'cat:avatar',
  tags: ['Cats'],
  description: 'Get a stable square cat avatar for a given seed (same seed, same cat)',
  responses: {
    200: {
      description: 'Avatar returned',
      content: {
        'image/*': {
          schema: { type: 'string', format: 'binary' }
        }
      }
    }
  }
}

export const handler = (ctx) => {
  const seed = ctx.req.params.seed.split('.')[0]
  // Delegating wrapper: no cat id/tag/text, square type forced, seeded pick
  const req = Object.create(ctx.req, {
    params: { value: {} },
    query: { value: { ...ctx.req.query, type: 'square' } }
  })

  return handleCatRequest({ ...ctx, req, rand: seededRandom(seed) })
}
